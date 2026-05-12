import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  LinearProgress,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  SkipNext as SkipNextIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import {
  fetchElections,
  fetchConstituencies,
  fetchMunicipalities,
  fetchConstituenciesByScope,
  fetchGPStates,
  fetchGPDistricts,
  fetchGPTaluks,
  fetchGPGrams,
  fetchGPVillages,
  type Election,
  type Constituency,
  type GPVillage,
} from "../services/electionService";
import { updateUserConstituencies } from "../services/authService";
import useAuthStore from "../store/useAuthStore";
import { BRAND } from "../theme";
import prajakeeyaLogo from "../assets/images/prajakeeya.png";

type Municipality = { id: number; name: string; state: string };

interface OnboardingAnswers {
  lokSabha?: Constituency;
  stateAssembly?: Constituency;
  municipality?: Municipality;
  cityWard?: Constituency;
  gpState?: string;
  gpDistrict?: string;
  gpTaluk?: string;
  gpGram?: string;
  gpVillage?: GPVillage;
}

const STORAGE_KEY = "__USER_LOCATION_ANSWERS__";

const STEPS = [
  {
    type: "lok_sabha",
    icon: "📍",
    title: "Lok Sabha Constituency",
    question: "Which Lok Sabha constituency does your area belong to?",
  },
  {
    type: "state_assembly",
    icon: "🏛",
    title: "State Assembly Constituency",
    question: "Which Assembly constituency is your area under?",
  },
  {
    type: "municipal_corporation",
    icon: "🏙",
    title: "Municipal Corporation / Ward",
    question: "Which Municipal Corporation and ward do you belong to?",
  },
  {
    type: "gram_panchayat",
    icon: "🌿",
    title: "Gram Panchayat",
    question:
      "Which State, District, Taluk, Gram Panchayat and village do you live in?",
  },
] as const;

const TOTAL_STEPS = STEPS.length;

const UserConstituencyOnboardingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const setAuth = useAuthStore((s) => s.setAuth);
  const token = useAuthStore((s) => s.token);

  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState<OnboardingAnswers>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Data caches
  const [, setElections] = useState<Election[]>([]);
  const [loadingElections, setLoadingElections] = useState(false);

  const [lokSabhaOptions, setLokSabhaOptions] = useState<Constituency[]>([]);
  const [loadingLokSabha, setLoadingLokSabha] = useState(false);
  const [stateAssemblyOptions, setStateAssemblyOptions] = useState<
    Constituency[]
  >([]);
  const [loadingStateAssembly, setLoadingStateAssembly] = useState(false);

  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [loadingMunicipalities, setLoadingMunicipalities] = useState(false);
  const [cityWards, setCityWards] = useState<Constituency[]>([]);
  const [loadingCityWards, setLoadingCityWards] = useState(false);

  const [gpStates, setGpStates] = useState<string[]>([]);
  const [gpDistricts, setGpDistricts] = useState<string[]>([]);
  const [gpTaluks, setGpTaluks] = useState<string[]>([]);
  const [gpGrams, setGpGrams] = useState<string[]>([]);
  const [gpVillages, setGpVillages] = useState<GPVillage[]>([]);
  const [loadingGpStates, setLoadingGpStates] = useState(false);
  const [loadingGpDistricts, setLoadingGpDistricts] = useState(false);
  const [loadingGpTaluks, setLoadingGpTaluks] = useState(false);
  const [loadingGpGrams, setLoadingGpGrams] = useState(false);
  const [loadingGpVillages, setLoadingGpVillages] = useState(false);

  const currentStep = STEPS[stepIdx];
  const isLast = stepIdx === TOTAL_STEPS - 1;
  const progress = ((stepIdx + 1) / TOTAL_STEPS) * 100;

  // Load elections once (only used to know they exist; not displayed)
  useEffect(() => {
    setLoadingElections(true);
    fetchElections()
      .then((resp) => setElections(Array.isArray(resp.data) ? resp.data : []))
      .catch(() => setElections([]))
      .finally(() => setLoadingElections(false));
  }, []);

  // Lazy-load each step's primary options when the step is entered
  useEffect(() => {
    const type = currentStep.type;
    if (type === "lok_sabha" && lokSabhaOptions.length === 0) {
      setLoadingLokSabha(true);
      fetchConstituencies("lok_sabha")
        .then((resp) => setLokSabhaOptions(resp.data?.constituencies ?? []))
        .catch(() => setLokSabhaOptions([]))
        .finally(() => setLoadingLokSabha(false));
    }
    if (type === "state_assembly" && stateAssemblyOptions.length === 0) {
      setLoadingStateAssembly(true);
      fetchConstituencies("state_assembly")
        .then((resp) =>
          setStateAssemblyOptions(resp.data?.constituencies ?? []),
        )
        .catch(() => setStateAssemblyOptions([]))
        .finally(() => setLoadingStateAssembly(false));
    }
    if (type === "municipal_corporation" && municipalities.length === 0) {
      setLoadingMunicipalities(true);
      fetchMunicipalities()
        .then((resp) =>
          setMunicipalities(Array.isArray(resp.data) ? resp.data : []),
        )
        .catch(() => setMunicipalities([]))
        .finally(() => setLoadingMunicipalities(false));
    }
    if (type === "gram_panchayat" && gpStates.length === 0) {
      setLoadingGpStates(true);
      fetchGPStates()
        .then((resp) => setGpStates(Array.isArray(resp.data) ? resp.data : []))
        .catch(() => setGpStates([]))
        .finally(() => setLoadingGpStates(false));
    }
  }, [currentStep.type]);

  // Municipality → city wards
  useEffect(() => {
    if (!answers.municipality) {
      setCityWards([]);
      return;
    }
    setLoadingCityWards(true);
    fetchConstituenciesByScope(answers.municipality.name)
      .then((resp) => setCityWards(Array.isArray(resp.data) ? resp.data : []))
      .catch(() => setCityWards([]))
      .finally(() => setLoadingCityWards(false));
  }, [answers.municipality]);

  // GP cascade
  useEffect(() => {
    if (!answers.gpState) {
      setGpDistricts([]);
      return;
    }
    setLoadingGpDistricts(true);
    fetchGPDistricts(answers.gpState)
      .then((resp) =>
        setGpDistricts(Array.isArray(resp.data) ? resp.data : []),
      )
      .catch(() => setGpDistricts([]))
      .finally(() => setLoadingGpDistricts(false));
  }, [answers.gpState]);

  useEffect(() => {
    if (!answers.gpState || !answers.gpDistrict) {
      setGpTaluks([]);
      return;
    }
    setLoadingGpTaluks(true);
    fetchGPTaluks(answers.gpState, answers.gpDistrict)
      .then((resp) => setGpTaluks(Array.isArray(resp.data) ? resp.data : []))
      .catch(() => setGpTaluks([]))
      .finally(() => setLoadingGpTaluks(false));
  }, [answers.gpState, answers.gpDistrict]);

  useEffect(() => {
    if (!answers.gpState || !answers.gpDistrict || !answers.gpTaluk) {
      setGpGrams([]);
      return;
    }
    setLoadingGpGrams(true);
    fetchGPGrams(answers.gpState, answers.gpDistrict, answers.gpTaluk)
      .then((resp) => setGpGrams(Array.isArray(resp.data) ? resp.data : []))
      .catch(() => setGpGrams([]))
      .finally(() => setLoadingGpGrams(false));
  }, [answers.gpState, answers.gpDistrict, answers.gpTaluk]);

  useEffect(() => {
    if (
      !answers.gpState ||
      !answers.gpDistrict ||
      !answers.gpTaluk ||
      !answers.gpGram
    ) {
      setGpVillages([]);
      return;
    }
    setLoadingGpVillages(true);
    fetchGPVillages(
      answers.gpState,
      answers.gpDistrict,
      answers.gpTaluk,
      answers.gpGram,
    )
      .then((resp) => setGpVillages(Array.isArray(resp.data) ? resp.data : []))
      .catch(() => setGpVillages([]))
      .finally(() => setLoadingGpVillages(false));
  }, [answers.gpState, answers.gpDistrict, answers.gpTaluk, answers.gpGram]);

  // ── per-step "has any value" check (Next enabled) ──
  const stepHasAnswer = (): boolean => {
    switch (currentStep.type) {
      case "lok_sabha":
        return !!answers.lokSabha;
      case "state_assembly":
        return !!answers.stateAssembly;
      case "municipal_corporation":
        return !!answers.municipality || !!answers.cityWard;
      case "gram_panchayat":
        return (
          !!answers.gpState ||
          !!answers.gpDistrict ||
          !!answers.gpTaluk ||
          !!answers.gpGram ||
          !!answers.gpVillage
        );
    }
  };

  // ── controls ──
  const finish = async (final: OnboardingAnswers) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(final));
    } catch {
      // ignore storage failures
    }

    const payload = {
      lokSabhaConstituencyId: final.lokSabha?.id ?? null,
      stateAssemblyConstituencyId: final.stateAssembly?.id ?? null,
      municipalCorporationConstituencyId: final.cityWard?.id ?? null,
      gramPanchayatConstituencyId: final.gpVillage?.id
        ? Number(final.gpVillage.id)
        : null,
    };

    const hasAnything =
      payload.lokSabhaConstituencyId != null ||
      payload.stateAssemblyConstituencyId != null ||
      payload.municipalCorporationConstituencyId != null ||
      payload.gramPanchayatConstituencyId != null;

    if (!hasAnything || !token) {
      navigate("/user/dashboard", { replace: true });
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      const { data } = await updateUserConstituencies(payload);
      setAuth(token, data);
      navigate("/user/dashboard", { replace: true });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to save. Please try again.";
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (submitting) return;
    if (!stepHasAnswer()) return;
    if (isLast) void finish(answers);
    else setStepIdx(stepIdx + 1);
  };

  const handleSkip = () => {
    if (submitting) return;
    const next: OnboardingAnswers = { ...answers };
    switch (currentStep.type) {
      case "lok_sabha":
        delete next.lokSabha;
        break;
      case "state_assembly":
        delete next.stateAssembly;
        break;
      case "municipal_corporation":
        delete next.municipality;
        delete next.cityWard;
        break;
      case "gram_panchayat":
        delete next.gpState;
        delete next.gpDistrict;
        delete next.gpTaluk;
        delete next.gpGram;
        delete next.gpVillage;
        break;
    }
    setAnswers(next);
    if (isLast) void finish(next);
    else setStepIdx(stepIdx + 1);
  };

  const handleBack = () => {
    if (stepIdx === 0) return;
    setStepIdx(stepIdx - 1);
  };

  // ── styling ──
  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      background: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.92)",
      "& fieldset": {
        borderColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(17,24,39,0.18)",
      },
      "&:hover fieldset": { borderColor: "rgba(245,168,0,0.45)" },
      "&.Mui-focused fieldset": {
        borderColor: BRAND.yellow,
        borderWidth: "1.5px",
      },
    },
    "& .MuiInputLabel-root": {
      color: isDark ? "rgba(255,255,255,0.55)" : "rgba(17,24,39,0.62)",
    },
    "& .MuiInputLabel-root.Mui-focused": { color: BRAND.yellow },
    "& .MuiInputBase-input": {
      color: isDark ? "#fff" : "rgba(15,23,42,0.94)",
      fontSize: "1rem",
    },
  };

  const listboxSx = {
    bgcolor: isDark ? "#1a1515" : "#fff",
    "& .MuiAutocomplete-option": {
      color: isDark ? "rgba(255,255,255,0.85)" : "rgba(15,23,42,0.9)",
      fontSize: "0.95rem",
      '&[aria-selected="true"]': {
        bgcolor: isDark ? "rgba(245,168,0,0.18)" : "rgba(245,168,0,0.14)",
      },
      "&.Mui-focused": {
        bgcolor: isDark ? "rgba(255,255,255,0.06)" : "rgba(17,24,39,0.04)",
      },
    },
  };

  // ── per-step content ──
  const renderStepFields = () => {
    switch (currentStep.type) {
      case "lok_sabha":
        return (
          <Autocomplete
            options={lokSabhaOptions}
            getOptionLabel={(o) =>
              `${o.number ? `${o.number} - ` : ""}${o.name}`
            }
            isOptionEqualToValue={(a, b) => a.id === b.id}
            value={answers.lokSabha ?? null}
            onChange={(_, v) =>
              setAnswers((p) => ({ ...p, lokSabha: v ?? undefined }))
            }
            loading={loadingLokSabha}
            ListboxProps={{ sx: listboxSx }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Lok Sabha Constituency"
                sx={fieldSx}
              />
            )}
          />
        );
      case "state_assembly":
        return (
          <Autocomplete
            options={stateAssemblyOptions}
            getOptionLabel={(o) =>
              `${o.number ? `${o.number} - ` : ""}${o.name}`
            }
            isOptionEqualToValue={(a, b) => a.id === b.id}
            value={answers.stateAssembly ?? null}
            onChange={(_, v) =>
              setAnswers((p) => ({ ...p, stateAssembly: v ?? undefined }))
            }
            loading={loadingStateAssembly}
            ListboxProps={{ sx: listboxSx }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Assembly Constituency"
                sx={fieldSx}
              />
            )}
          />
        );
      case "municipal_corporation":
        return (
          <Stack spacing={2}>
            <Autocomplete
              options={municipalities}
              getOptionLabel={(o) => o.name}
              isOptionEqualToValue={(a, b) => a.id === b.id}
              value={answers.municipality ?? null}
              onChange={(_, v) =>
                setAnswers((p) => ({
                  ...p,
                  municipality: v ?? undefined,
                  cityWard: undefined,
                }))
              }
              loading={loadingMunicipalities}
              ListboxProps={{ sx: listboxSx }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Corporation / Municipality"
                  sx={fieldSx}
                />
              )}
            />
            <Autocomplete
              options={cityWards}
              getOptionLabel={(o) =>
                `${o.number ? `${o.number} - ` : ""}${o.name}`
              }
              isOptionEqualToValue={(a, b) => a.id === b.id}
              value={answers.cityWard ?? null}
              onChange={(_, v) =>
                setAnswers((p) => ({ ...p, cityWard: v ?? undefined }))
              }
              loading={loadingCityWards}
              disabled={!answers.municipality}
              ListboxProps={{ sx: listboxSx }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="City Corporation Ward"
                  sx={fieldSx}
                />
              )}
            />
          </Stack>
        );
      case "gram_panchayat":
        return (
          <Stack spacing={2}>
            <Autocomplete
              options={gpStates}
              value={answers.gpState ?? null}
              onChange={(_, v) =>
                setAnswers((p) => ({
                  ...p,
                  gpState: v ?? undefined,
                  gpDistrict: undefined,
                  gpTaluk: undefined,
                  gpGram: undefined,
                  gpVillage: undefined,
                }))
              }
              loading={loadingGpStates}
              ListboxProps={{ sx: listboxSx }}
              renderInput={(params) => (
                <TextField {...params} label="State" sx={fieldSx} />
              )}
            />
            <Autocomplete
              options={gpDistricts}
              value={answers.gpDistrict ?? null}
              onChange={(_, v) =>
                setAnswers((p) => ({
                  ...p,
                  gpDistrict: v ?? undefined,
                  gpTaluk: undefined,
                  gpGram: undefined,
                  gpVillage: undefined,
                }))
              }
              loading={loadingGpDistricts}
              disabled={!answers.gpState}
              ListboxProps={{ sx: listboxSx }}
              renderInput={(params) => (
                <TextField {...params} label="District" sx={fieldSx} />
              )}
            />
            <Autocomplete
              options={gpTaluks}
              value={answers.gpTaluk ?? null}
              onChange={(_, v) =>
                setAnswers((p) => ({
                  ...p,
                  gpTaluk: v ?? undefined,
                  gpGram: undefined,
                  gpVillage: undefined,
                }))
              }
              loading={loadingGpTaluks}
              disabled={!answers.gpDistrict}
              ListboxProps={{ sx: listboxSx }}
              renderInput={(params) => (
                <TextField {...params} label="Taluk" sx={fieldSx} />
              )}
            />
            <Autocomplete
              options={gpGrams}
              value={answers.gpGram ?? null}
              onChange={(_, v) =>
                setAnswers((p) => ({
                  ...p,
                  gpGram: v ?? undefined,
                  gpVillage: undefined,
                }))
              }
              loading={loadingGpGrams}
              disabled={!answers.gpTaluk}
              ListboxProps={{ sx: listboxSx }}
              renderInput={(params) => (
                <TextField {...params} label="Gram Panchayat" sx={fieldSx} />
              )}
            />
            <Autocomplete
              options={gpVillages}
              getOptionLabel={(o) => o.villageName}
              isOptionEqualToValue={(a, b) => a.id === b.id}
              value={answers.gpVillage ?? null}
              onChange={(_, v) =>
                setAnswers((p) => ({ ...p, gpVillage: v ?? undefined }))
              }
              loading={loadingGpVillages}
              disabled={!answers.gpGram}
              ListboxProps={{ sx: listboxSx }}
              renderInput={(params) => (
                <TextField {...params} label="Village" sx={fieldSx} />
              )}
            />
          </Stack>
        );
    }
  };

  const anyLoading =
    loadingElections ||
    (currentStep.type === "lok_sabha" && loadingLokSabha) ||
    (currentStep.type === "state_assembly" && loadingStateAssembly) ||
    (currentStep.type === "municipal_corporation" &&
      (loadingMunicipalities || loadingCityWards)) ||
    (currentStep.type === "gram_panchayat" &&
      (loadingGpStates ||
        loadingGpDistricts ||
        loadingGpTaluks ||
        loadingGpGrams ||
        loadingGpVillages));

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: isDark
          ? "radial-gradient(ellipse at 50% 0%, #1a0a0a 0%, #0a0505 55%, #000 100%)"
          : "radial-gradient(ellipse at 50% 0%, #fff8ee 0%, #f5efe2 55%, #ece4d2 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        px: { xs: 2, sm: 3 },
        py: { xs: 3, sm: 5 },
      }}
    >
      {/* Brand strip */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.2}
        sx={{ mb: { xs: 3, sm: 5 } }}
      >
        <Box
          component="img"
          src={prajakeeyaLogo}
          alt="Prajaakeeya"
          sx={{ height: 36, objectFit: "contain" }}
        />
        <Typography
          sx={{
            fontFamily: '"Bebas Neue", "Impact", sans-serif',
            fontSize: { xs: "1.05rem", sm: "1.2rem" },
            letterSpacing: "0.08em",
            background:
              "linear-gradient(135deg, #E02010 0%, #FFCB00 45%, #F5A800 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          PRAJAAKEEYA
        </Typography>
      </Stack>

      {/* Card */}
      <Box
        sx={{
          width: "100%",
          maxWidth: 720,
          background: isDark
            ? "linear-gradient(160deg, rgba(28,16,16,0.92) 0%, rgba(19,11,11,0.96) 100%)"
            : "rgba(255,255,255,0.92)",
          border: isDark
            ? "1px solid rgba(245,168,0,0.18)"
            : "1px solid rgba(245,168,0,0.32)",
          borderRadius: 4,
          boxShadow: isDark
            ? "0 24px 64px rgba(0,0,0,0.55)"
            : "0 16px 48px rgba(17,24,39,0.10)",
          backdropFilter: "blur(12px)",
          p: { xs: 3, sm: 5 },
        }}
      >
        {/* Step header */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 1.2 }}
        >
          <Typography
            sx={{
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: BRAND.yellow,
              textTransform: "uppercase",
            }}
          >
            Step {stepIdx + 1} of {TOTAL_STEPS}
          </Typography>
          <Typography
            sx={{
              fontSize: "0.75rem",
              color: isDark
                ? "rgba(255,255,255,0.45)"
                : "rgba(17,24,39,0.55)",
            }}
          >
            {Math.round(progress)}%
          </Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            mb: 4,
            borderRadius: 2,
            height: 6,
            bgcolor: isDark
              ? "rgba(255,255,255,0.06)"
              : "rgba(17,24,39,0.08)",
            "& .MuiLinearProgress-bar": {
              background:
                "linear-gradient(90deg, #F5A800 0%, #E02010 100%)",
              borderRadius: 2,
            },
          }}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep.type}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.4}
              sx={{ mb: 1 }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  background:
                    "linear-gradient(135deg, rgba(245,168,0,0.18) 0%, rgba(224,32,16,0.12) 100%)",
                  border: "1px solid rgba(245,168,0,0.35)",
                }}
              >
                {currentStep.icon}
              </Box>
              <Typography
                sx={{
                  fontSize: { xs: "1.2rem", sm: "1.45rem" },
                  fontWeight: 800,
                  color: isDark ? "#fff" : "rgba(17,24,39,0.92)",
                  letterSpacing: "-0.01em",
                }}
              >
                {currentStep.title}
              </Typography>
            </Stack>

            <Typography
              sx={{
                fontSize: { xs: "0.95rem", sm: "1.05rem" },
                color: isDark
                  ? "rgba(255,255,255,0.65)"
                  : "rgba(17,24,39,0.65)",
                mb: 3,
                lineHeight: 1.55,
              }}
            >
              {currentStep.question}
            </Typography>

            <Box sx={{ mb: 1.5 }}>{renderStepFields()}</Box>

            {anyLoading && (
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ mb: 1 }}
              >
                <CircularProgress size={14} sx={{ color: BRAND.yellow }} />
                <Typography
                  sx={{
                    fontSize: "0.8rem",
                    color: isDark
                      ? "rgba(255,255,255,0.5)"
                      : "rgba(17,24,39,0.55)",
                  }}
                >
                  Loading options…
                </Typography>
              </Stack>
            )}

            {submitError && (
              <Typography
                sx={{
                  mt: 2,
                  fontSize: "0.85rem",
                  color: "#f87171",
                  background: "rgba(200,24,10,0.10)",
                  border: "1px solid rgba(200,24,10,0.28)",
                  borderRadius: 1.5,
                  px: 1.5,
                  py: 1,
                }}
              >
                {submitError}
              </Typography>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Actions */}
        <Stack
          direction={{ xs: "column-reverse", sm: "row" }}
          spacing={1.5}
          sx={{ mt: 4 }}
        >
          {stepIdx > 0 && (
            <Button
              variant="text"
              onClick={handleBack}
              startIcon={<ArrowBackIcon />}
              sx={{
                color: isDark
                  ? "rgba(255,255,255,0.6)"
                  : "rgba(17,24,39,0.6)",
                fontWeight: 600,
                textTransform: "none",
                fontSize: "0.95rem",
                "&:hover": {
                  bgcolor: isDark
                    ? "rgba(255,255,255,0.04)"
                    : "rgba(17,24,39,0.04)",
                },
              }}
            >
              Back
            </Button>
          )}
          <Box sx={{ flex: 1 }} />
          <Button
            variant="outlined"
            onClick={handleSkip}
            disabled={submitting}
            startIcon={<SkipNextIcon />}
            sx={{
              py: 1.25,
              px: 3,
              borderRadius: 2.5,
              fontWeight: 700,
              textTransform: "none",
              fontSize: "0.95rem",
              borderColor: isDark
                ? "rgba(255,255,255,0.18)"
                : "rgba(17,24,39,0.2)",
              color: isDark
                ? "rgba(255,255,255,0.75)"
                : "rgba(17,24,39,0.72)",
              "&:hover": {
                borderColor: isDark
                  ? "rgba(255,255,255,0.32)"
                  : "rgba(17,24,39,0.38)",
                bgcolor: isDark
                  ? "rgba(255,255,255,0.04)"
                  : "rgba(17,24,39,0.04)",
              },
            }}
          >
            Skip
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={!stepHasAnswer() || submitting}
            endIcon={
              submitting ? (
                <CircularProgress size={16} sx={{ color: "#fff" }} />
              ) : isLast ? (
                <CheckCircleIcon />
              ) : (
                <ArrowForwardIcon />
              )
            }
            sx={{
              py: 1.25,
              px: 4,
              borderRadius: 2.5,
              fontWeight: 800,
              textTransform: "none",
              fontSize: "0.95rem",
              color: "#fff",
              background:
                "linear-gradient(135deg, #C8180A 0%, #E02010 100%)",
              boxShadow: "0 6px 20px rgba(200,24,10,0.35)",
              "&:hover": {
                background:
                  "linear-gradient(135deg, #E02010 0%, #C8180A 100%)",
                boxShadow: "0 8px 26px rgba(200,24,10,0.5)",
              },
              "&.Mui-disabled": {
                background: isDark
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(17,24,39,0.08)",
                color: isDark
                  ? "rgba(255,255,255,0.3)"
                  : "rgba(17,24,39,0.35)",
                boxShadow: "none",
              },
            }}
          >
            {isLast ? "Finish" : "Next"}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default UserConstituencyOnboardingPage;
