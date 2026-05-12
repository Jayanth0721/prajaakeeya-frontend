import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  LinearProgress,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  ArrowForward as ArrowForwardIcon,
  SkipNext as SkipNextIcon,
} from "@mui/icons-material";
import SplitAuthLayout from "../components/SplitAuthLayout";
import prajakeeyaLogo from "../assets/images/prajakeeya.png";

interface StepDef {
  key: "loksabha" | "assembly" | "ward" | "panchayat";
  icon: string;
  titleKey: string;
  questionKey: string;
  placeholderKey: string;
}

const STEPS: StepDef[] = [
  {
    key: "loksabha",
    icon: "📍",
    titleKey: "step1Title",
    questionKey: "step1Question",
    placeholderKey: "step1Placeholder",
  },
  {
    key: "assembly",
    icon: "🏛",
    titleKey: "step2Title",
    questionKey: "step2Question",
    placeholderKey: "step2Placeholder",
  },
  {
    key: "ward",
    icon: "🏙",
    titleKey: "step3Title",
    questionKey: "step3Question",
    placeholderKey: "step3Placeholder",
  },
  {
    key: "panchayat",
    icon: "🌿",
    titleKey: "step4Title",
    questionKey: "step4Question",
    placeholderKey: "step4Placeholder",
  },
];

const STORAGE_KEY = "__USER_LOCATION_ANSWERS__";

const UserConstituencyOnboardingPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentValue, setCurrentValue] = useState("");

  const step = STEPS[stepIdx];
  const isLast = stepIdx === STEPS.length - 1;
  const progress = ((stepIdx + 1) / STEPS.length) * 100;

  const finish = (final: Record<string, string>) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(final));
    } catch {
      // ignore storage failures
    }
    navigate("/user/dashboard", { replace: true });
  };

  const handleNext = () => {
    const value = currentValue.trim();
    if (!value) return;
    const next = { ...answers, [step.key]: value };
    setAnswers(next);
    setCurrentValue("");
    if (isLast) {
      finish(next);
    } else {
      setStepIdx(stepIdx + 1);
    }
  };

  const handleSkip = () => {
    setCurrentValue("");
    if (isLast) {
      finish(answers);
    } else {
      setStepIdx(stepIdx + 1);
    }
  };

  const darkFieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      background: isDark ? "rgba(255,255,255,0.04)" : "rgba(17,24,39,0.03)",
      "& fieldset": {
        borderColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(17,24,39,0.18)",
      },
      "&:hover fieldset": {
        borderColor: "rgba(245,168,0,0.45)",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#F5A800",
        borderWidth: "1.5px",
      },
    },
    "& .MuiInputBase-input": {
      color: isDark ? "#fff" : "rgba(15,23,42,0.94)",
    },
  };

  return (
    <SplitAuthLayout
      leftTitle={t("pages.constituencyOnboarding.leftTitle")}
      leftSubtitle={t("pages.constituencyOnboarding.leftSubtitle")}
      cardTitle={t("pages.constituencyOnboarding.cardTitle")}
      topContent={
        <Box
          sx={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box
            component="img"
            src={prajakeeyaLogo}
            alt="Prajaakeeya"
            sx={{ height: { xs: 64, sm: 80 }, objectFit: "contain" }}
          />
          <Typography
            sx={{
              fontFamily: '"Bebas Neue", "Impact", sans-serif',
              fontSize: { xs: "1.4rem", sm: "1.7rem" },
              letterSpacing: "0.08em",
              lineHeight: 1,
              background: isDark
                ? "linear-gradient(135deg, #E02010 0%, #FFCB00 45%, #F5A800 100%)"
                : "linear-gradient(135deg, #E02010 0%, #c32d0c 45%, #ff9500 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {t("pages.login.oath.title")}
          </Typography>
        </Box>
      }
    >
      <Box sx={{ width: "100%", maxWidth: 540, mx: "auto" }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 1 }}
        >
          <Typography
            sx={{
              fontSize: "0.78rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: "#F5A800",
              textTransform: "uppercase",
            }}
          >
            {t("pages.constituencyOnboarding.stepCounter", {
              current: stepIdx + 1,
              total: STEPS.length,
            })}
          </Typography>
          <Typography
            sx={{
              fontSize: "0.78rem",
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
            mb: 3,
            borderRadius: 1,
            height: 6,
            bgcolor: isDark
              ? "rgba(255,255,255,0.08)"
              : "rgba(17,24,39,0.08)",
            "& .MuiLinearProgress-bar": {
              background: "linear-gradient(90deg, #F5A800 0%, #E02010 100%)",
              borderRadius: 1,
            },
          }}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={step.key}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <Typography
              sx={{
                fontSize: { xs: "1.15rem", sm: "1.3rem" },
                fontWeight: 700,
                mb: 1,
                color: isDark ? "#fff" : "rgba(17,24,39,0.92)",
              }}
            >
              <Box component="span" sx={{ mr: 1 }}>
                {step.icon}
              </Box>
              {t(`pages.constituencyOnboarding.${step.titleKey}`)}
            </Typography>

            <Typography
              sx={{
                fontSize: "0.95rem",
                color: isDark
                  ? "rgba(255,255,255,0.65)"
                  : "rgba(17,24,39,0.65)",
                mb: 2.5,
                lineHeight: 1.5,
              }}
            >
              {t(`pages.constituencyOnboarding.${step.questionKey}`)}
            </Typography>

            <TextField
              fullWidth
              autoFocus
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && currentValue.trim()) {
                  e.preventDefault();
                  handleNext();
                }
              }}
              placeholder={t(
                `pages.constituencyOnboarding.${step.placeholderKey}`,
              )}
              sx={{ mb: 3, ...darkFieldSx }}
            />
          </motion.div>
        </AnimatePresence>

        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            fullWidth
            onClick={handleSkip}
            startIcon={<SkipNextIcon />}
            sx={{
              py: 1.2,
              borderRadius: 2,
              fontWeight: 700,
              textTransform: "none",
              fontSize: "0.95rem",
              borderColor: isDark
                ? "rgba(255,255,255,0.18)"
                : "rgba(17,24,39,0.2)",
              color: isDark
                ? "rgba(255,255,255,0.75)"
                : "rgba(17,24,39,0.75)",
              "&:hover": {
                borderColor: isDark
                  ? "rgba(255,255,255,0.35)"
                  : "rgba(17,24,39,0.4)",
                bgcolor: isDark
                  ? "rgba(255,255,255,0.04)"
                  : "rgba(17,24,39,0.04)",
              },
            }}
          >
            {t("pages.constituencyOnboarding.skip")}
          </Button>

          <Button
            variant="contained"
            fullWidth
            onClick={handleNext}
            disabled={!currentValue.trim()}
            endIcon={<ArrowForwardIcon />}
            sx={{
              py: 1.2,
              borderRadius: 2,
              fontWeight: 800,
              textTransform: "none",
              fontSize: "0.95rem",
              color: "#fff",
              background:
                "linear-gradient(135deg, #C8180A 0%, #E02010 100%)",
              boxShadow: "0 4px 20px rgba(200,24,10,0.35)",
              "&:hover": {
                background:
                  "linear-gradient(135deg, #E02010 0%, #C8180A 100%)",
                boxShadow: "0 6px 24px rgba(200,24,10,0.5)",
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
            {isLast
              ? t("pages.constituencyOnboarding.finish")
              : t("pages.constituencyOnboarding.next")}
          </Button>
        </Stack>
      </Box>
    </SplitAuthLayout>
  );
};

export default UserConstituencyOnboardingPage;
