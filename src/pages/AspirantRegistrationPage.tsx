import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm, type Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Snackbar,
  Alert,
  Box,
  Typography,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  HowToVote as HowToVoteIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../store/useAuthStore';
import { createAspirantSchema } from '../utils/validation';
import { fetchElections as fetchElectionsList, type Election } from '../services/electionService';
import { registerAspirant, type AspirantPayload, getAspirantById } from '../services/aspirantService';
import { isFileSizeValid } from '../utils/fileUtils';
import { uploadAspirantDocument, uploadProfilePicture } from '../services/mediaService';
import SopFlowChart from '../components/aspirant/SopFlowChart';
import DeclarationStep from '../components/aspirant/DeclarationStep';
import CandidateInformationStep from '../components/aspirant/CandidateInformationStep';
import DocumentsUploadStep from '../components/aspirant/DocumentsUploadStep';
import LivePhotoCaptureStep from '../components/aspirant/LivePhotoCaptureStep';

interface AspirantForm {
  name: string;
  manifesto: string;
  electionId: number | string;
  constituencyId: number | string;
  party?: string;
  age?: number | string;
  education?: string;
  occupation?: string;
  gender?: string;
  phone?: string;
  address?: string;
  instagramLink?: string;
  facebookLink?: string;
  linkedinLink?: string;
  twitterLink?: string;
  whatsappNumber?: string;
  // Detailed candidate responses are captured via the questionnaire `answers` array
}

interface UploadedFile {
  name: string;
  size: number;
  uploaded: boolean;
  progress: number;
  error?: boolean;
  errorMessage?: string;
}

const AspirantRegistrationPage = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { user, fetchProfile } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [sopAgreed, setSopAgreed] = useState(true);
  const [answers, setAnswers] = useState<string[]>(Array(9).fill(''));
  const [documents, setDocuments] = useState({
    resume: null as UploadedFile | null,
    epic: null as UploadedFile | null,
    epicBack: null as UploadedFile | null,
    addressProof: null as UploadedFile | null,
    photo: null as UploadedFile | null,
    signedAgreement: null as UploadedFile | null,
    codeOfConduct: null as UploadedFile | null,
    sopEn: null as UploadedFile | null,
    sopKn: null as UploadedFile | null
  });
  const [aspirantResp, setAspirantResp] = useState<any | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [declarationChecks, setDeclarationChecks] = useState({
    agreed: false,
  });
  const [digitalSignature, setDigitalSignature] = useState('');
  const [declarationPlace, setDeclarationPlace] = useState('');
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Election type ref for dynamic age validation in yup schema
  const electionsRef = useRef<Election[]>([]);
  const electionIdRef = useRef<number | string>('');
  const aspirantFormSchema = useRef(createAspirantSchema(() => {
    const election = electionsRef.current.find((e) => String(e.id) === String(electionIdRef.current));
    return election?.type ?? '';
  })).current;

  const { register, reset, resetField, setValue, watch, trigger, setError: setFormError, clearErrors, formState: { errors } } = useForm<AspirantForm>({
    resolver: yupResolver(aspirantFormSchema) as unknown as Resolver<AspirantForm>,
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: user?.name || t('forms.aspirant.defaults.name'),
      manifesto: '',
      electionId: '',
      constituencyId: '',
      party: 'Independent',
      age: user?.age?.toString() || '',
      address: (user as any)?.address || '',
      education: '',
      occupation: '',
      gender: user?.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1).toLowerCase() : '',
      phone: user?.phone || '',
      // questionnaire-driven fields are not part of defaultValues
    }
  });

  // Keep election ref in sync for dynamic age validation (synchronous to avoid race conditions)
  const watchedElectionId = watch('electionId');
  electionIdRef.current = watchedElectionId;

  useEffect(() => {
    fetchElectionsList()
      .then((resp) => {
        const data = Array.isArray(resp.data) ? resp.data : [];
        electionsRef.current = data;
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (user) {
      try {
        // Set name
        if (user.name) {
          setValue('name', user.name);
        }
        // Set age from user data
        if (user.age) {
          setValue('age', user.age.toString());
        }
        // Set gender (capitalize first letter to match UI options)
        if (user.gender) {
          const capitalizedGender = user.gender.charAt(0).toUpperCase() + user.gender.slice(1).toLowerCase();
          setValue('gender', capitalizedGender);
        }
        // Set phone number
        if (user.phone) {
          setValue('phone', user.phone);
        }
        // Set address
        if ((user as any)?.address) {
          setValue('address', (user as any).address);
        }
      } catch (e) {
        console.warn('Failed to populate user data:', e);
      }
    }
  }, [user, setValue]);

  const DRAFT_KEY = `aspirant_registration_draft_${user?.id ?? 'guest'}`;

  useEffect(() => {
    const shouldResume = Boolean((location as any)?.state?.resume);
    if (!shouldResume) return;
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const vals = parsed.values || {};
      Object.keys(vals).forEach((k) => {
        try { setValue(k as any, vals[k]); } catch (e) { /* ignore */ }
      });
      if (Array.isArray(parsed.answers)) setAnswers(parsed.answers);
      if (parsed.documents) {
        setDocuments({
          resume: parsed.documents.resume ? { name: parsed.documents.resume.name, size: 0, uploaded: !!parsed.documents.resume.uploaded, progress: parsed.documents.resume.progress || 0 } : null,
          epic: parsed.documents.epic ? { name: parsed.documents.epic.name, size: 0, uploaded: !!parsed.documents.epic.uploaded, progress: parsed.documents.epic.progress || 0 } : null,
          epicBack: parsed.documents.epicBack ? { name: parsed.documents.epicBack.name, size: 0, uploaded: !!parsed.documents.epicBack.uploaded, progress: parsed.documents.epicBack.progress || 0 } : null,
          addressProof: parsed.documents.addressProof ? { name: parsed.documents.addressProof.name, size: 0, uploaded: !!parsed.documents.addressProof.uploaded, progress: parsed.documents.addressProof.progress || 0 } : null,
          photo: parsed.documents.photo ? { name: parsed.documents.photo.name, size: 0, uploaded: !!parsed.documents.photo.uploaded, progress: parsed.documents.photo.progress || 0 } : null,
          signedAgreement: parsed.documents.signedAgreement ? { name: parsed.documents.signedAgreement.name, size: 0, uploaded: !!parsed.documents.signedAgreement.uploaded, progress: parsed.documents.signedAgreement.progress || 0 } : null,
          codeOfConduct: parsed.documents.codeOfConduct ? { name: parsed.documents.codeOfConduct.name, size: 0, uploaded: !!parsed.documents.codeOfConduct.uploaded, progress: parsed.documents.codeOfConduct.progress || 0 } : null,
          sopEn: parsed.documents.sopEn ? { name: parsed.documents.sopEn.name, size: 0, uploaded: !!parsed.documents.sopEn.uploaded, progress: parsed.documents.sopEn.progress || 0 } : null,
          sopKn: parsed.documents.sopKn ? { name: parsed.documents.sopKn.name, size: 0, uploaded: !!parsed.documents.sopKn.uploaded, progress: parsed.documents.sopKn.progress || 0 } : null
        });
      }
      if (parsed.capturedPhoto) setCapturedPhoto(parsed.capturedPhoto);
      // clear resume state so navigating back doesn't re-trigger
      try { if ((location as any).state) (location as any).state.resume = false; } catch (e) { /* ignore */ }
      window.scrollTo(0, 0);
    } catch (e) {
      console.warn('Failed to load aspirant draft', e);
    }
  }, [DRAFT_KEY, location, setValue]);

  const watchedValues = watch();
  useEffect(() => {
    try {
      const docMeta = Object.entries(documents).reduce((acc, [k, v]) => {
        acc[k] = v ? { name: v.name, uploaded: v.uploaded, progress: v.progress } : null;
        return acc;
      }, {} as Record<string, any>);
      const payload = {
        values: watchedValues,
        answers,
        documents: docMeta,
        capturedPhoto,
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
    } catch (e) {
      // ignore
    }
  }, [watchedValues, answers, documents, capturedPhoto, DRAFT_KEY]);

  // On initial load, skip to Documents step if user already has an aspirant record
  const hasSkippedToDocsRef = useRef(false);
  useEffect(() => {
    if (user?.aspirantId && !hasSkippedToDocsRef.current && activeStep === 0 && !loading) {
      hasSkippedToDocsRef.current = true;
      setSopAgreed(true);
      setDeclarationChecks({ agreed: true });
      setActiveStep(2);
      window.scrollTo(0, 0);
    }
  }, [user?.aspirantId, activeStep, loading]);


  useEffect(() => {
    if (!aspirantResp?.id) return;

    // Only restore if form is empty (avoid overwriting user's current edits)
    const currentAnswers = answers.filter(a => a.trim().length > 0).length;
    if (currentAnswers > 0) return;

    try {
      if (aspirantResp.name) setValue('name', aspirantResp.name);
      if (aspirantResp.party) setValue('party', aspirantResp.party);
      if (aspirantResp.age) setValue('age', aspirantResp.age);
      if (aspirantResp.education) setValue('education', aspirantResp.education);
      if (aspirantResp.occupation) setValue('occupation', aspirantResp.occupation);
      if (aspirantResp.manifesto) setValue('manifesto', aspirantResp.manifesto);
      if (aspirantResp.address) setValue('address', aspirantResp.address);

      const backendAnswers = [
        aspirantResp.identityBackground || '',
        aspirantResp.resignationPledge || '',
        aspirantResp.noHighCommand || '',
        aspirantResp.technicalCompetence || '',
        aspirantResp.transparency || '',
        aspirantResp.emergencyProtocol || '',
        aspirantResp.expertConsultation || '',
        aspirantResp.voterFeedback || '',
        aspirantResp.primaryRule || ''
      ];

      const hasBackendAnswers = backendAnswers.some(a => a.trim().length > 0);
      if (hasBackendAnswers) {
        setAnswers(backendAnswers);
      }
    } catch (e) {
      console.warn('Failed to restore from aspirantResp', e);
    }
  }, [aspirantResp, setValue]);

  // Ensure Declaration step always scrolls to top when activated
  useEffect(() => {
    if (activeStep === 0) {
      // Use instant jump to avoid any downward scrolling animation
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  }, [activeStep]);

  const handleResetCandidateWritableFields = () => {
    resetField('phone', { defaultValue: user?.phone || '' });
    resetField('gender', {
      defaultValue: user?.gender
        ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1).toLowerCase()
        : '',
    });
    resetField('age', { defaultValue: user?.age?.toString() || '' });
    resetField('address', { defaultValue: (user as any)?.address || '' });
    resetField('education', { defaultValue: '' });
    resetField('occupation', { defaultValue: '' });
    resetField('manifesto', { defaultValue: '' });
  };

  const handleNext = async () => {
    if (activeStep === 0) {
      setActiveStep(1);
      window.scrollTo(0, 0);
      return;
    }

    if (activeStep === 1) {
      const valid = await trigger(['name', 'electionId', 'constituencyId', 'manifesto', 'party', 'age', 'education', 'occupation', 'address']);
      if (!valid) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      await handleSubmitRegistration(false);
      return;
    }

    if (activeStep === 2) {
      // Step 3 is the final step (Documents + Live Photo).
      // Refresh profile / aspirant data from server before showing success dialog
      try {
        setLoading(true);
        try { await fetchProfile(); } catch (e) { /* non-fatal */ }
        const aspirantIdToFetch = (aspirantResp && aspirantResp.id) ? aspirantResp.id : (user?.aspirantId ?? null);
        if (aspirantIdToFetch) {
          try {
            const resp = await getAspirantById(Number(aspirantIdToFetch));
            setAspirantResp(resp?.data ?? resp);
          } catch (e) {
            // ignore
          }
        }
      } finally {
        setLoading(false);
      }

      setSuccessDialogOpen(true);
      return;
    }

    setActiveStep((prev) => prev + 1);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleHome = () => {
    navigate('/user/dashboard', { replace: true });
  };

  const handleFileUpload = (docType: keyof typeof documents) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size before attempting upload
      if (!isFileSizeValid(file)) {
        // Mark document as failed with error
        setDocuments(prev => ({
          ...prev,
          [docType]: {
            name: file.name,
            size: file.size,
            uploaded: false,
            progress: 0,
            error: true,
            errorMessage: t('forms.aspirant.messages.fileSize2mb')
          }
        }));
        // reset the input
        event.target.value = '';
        return;
      }
      // File type validation
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      let isValidType = false;
      let errorMessage = '';

      switch (docType) {
        case 'resume':
          isValidType = fileExtension === 'pdf';
          errorMessage = t('forms.aspirant.messages.resumePdfOnly');
          break;
        case 'epic':
        case 'epicBack':
          isValidType = ['jpg', 'jpeg', 'png'].includes(fileExtension || '');
          errorMessage = t('forms.aspirant.messages.epicImageOnly');
          break;
        case 'addressProof':
          isValidType = ['jpg', 'jpeg', 'png'].includes(fileExtension || '');
          errorMessage = t('forms.aspirant.messages.addressProofImageOnly');
          break;
        case 'photo':
          isValidType = ['jpg', 'jpeg', 'png'].includes(fileExtension || '');
          errorMessage = t('forms.aspirant.messages.photoImageOnly');
          break;
        case 'signedAgreement':
        case 'codeOfConduct':
          isValidType = fileExtension === 'pdf';
          errorMessage = t('forms.aspirant.messages.pdfOnly');
          break;
        default:
          isValidType = true;
      }

      if (!isValidType) {
        // Mark document as failed with error
        setDocuments(prev => ({
          ...prev,
          [docType]: {
            name: file.name,
            size: file.size,
            uploaded: false,
            progress: 0,
            error: true,
            errorMessage: errorMessage
          }
        }));
        // Reset the input
        event.target.value = '';
        return;
      }

      // update UI immediately
      const uploadedFile: UploadedFile = { name: file.name, size: file.size, uploaded: false, progress: 10 };
      setDocuments(prev => ({ ...prev, [docType]: uploadedFile }));

      // Get aspirantId from response or user profile
      const aspirantId = aspirantResp?.id ?? user?.aspirantId ?? null;
      if (!aspirantId) {
        setError(t('forms.aspirant.messages.missingAspirantRecord'));
        setOpen(true);
        // reset input
        event.target.value = '';
        return;
      }

      // Map UI docType to API documentType
      const docTypeMap: Record<string, string> = {
        resume: 'resume',
        epic: 'epic_card',
        epicBack: 'epic_card_back',
        addressProof: 'address_proof',
        photo: 'recent_photo',
        signedAgreement: 'agreement',
        codeOfConduct: 'code_of_conduct'
      };

      const apiDocType = docTypeMap[docType] || String(docType);

      (async () => {
        try {
          setLoading(true);
          const result = await uploadAspirantDocument(Number(aspirantId), apiDocType, file);
          // server returns updated aspirant object; update documents state to uploaded
          setDocuments(prev => ({ ...prev, [docType]: { name: file.name, size: file.size, uploaded: true, progress: 100 } }));
          // update aspirantResp with latest data
          setAspirantResp(result ?? aspirantResp);
          // reset the file input value so re-selecting the same file after delete triggers onChange
          event.target.value = '';
        } catch (err: any) {
          console.error('Document upload failed', err?.response?.data || err);
          const status = err?.response?.status;
          // Axios uses `code` === 'ERR_NETWORK' for network-level failures
          const code = err?.code;
          let errorMsg = t('forms.aspirant.messages.uploadFailed');
          if (status === 413) {
            errorMsg = t('forms.aspirant.messages.fileSize10mb');
          } else if (code === 'ERR_NETWORK' || !err?.response) {
            errorMsg = t('forms.aspirant.messages.uploadFailedMaybeLarge');
          } else {
            errorMsg = err?.response?.data?.message || err?.message || t('forms.aspirant.messages.uploadFailed');
          }
          // Mark document as failed with error
          setDocuments(prev => ({
            ...prev,
            [docType]: {
              name: file.name,
              size: file.size,
              uploaded: false,
              progress: 0,
              error: true,
              errorMessage: errorMsg
            }
          }));
          // reset the file input value so user can retry
          event.target.value = '';
        } finally {
          setLoading(false);
        }
      })();
    }
  };

  const startCamera = async () => {
    try {
      setError('');

      // Stop any existing stream
      stopCamera();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });

      if (!videoRef.current) {
        setError(t('forms.aspirant.messages.cameraNotReady'));
        return;
      }

      const video = videoRef.current;

      video.srcObject = stream;
      video.muted = true;
      video.playsInline = true;
      await video.play();

      setCameraActive(true);
    } catch (err) {
      console.error('Camera error:', err);
      setError(t('forms.aspirant.messages.cameraStartError'));
    }
  };


  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };


  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        const video = videoRef.current;

        // Make canvas square using the smaller dimension
        const size = Math.min(video.videoWidth, video.videoHeight);
        canvasRef.current.width = size;
        canvasRef.current.height = size;

        // Calculate center crop offsets
        const offsetX = (video.videoWidth - size) / 2;
        const offsetY = (video.videoHeight - size) / 2;

        // Draw center-cropped video frame to square canvas
        context.drawImage(
          video,
          offsetX, offsetY, size, size,  // source rectangle (center crop)
          0, 0, size, size                // destination rectangle (full canvas)
        );

        // Convert canvas to image data URL
        const imageData = canvasRef.current.toDataURL('image/png');
        setCapturedPhoto(imageData);

        // Clear any previous file errors now that a valid capture exists
        setError('');
        setOpen(false);

        // Stop camera after capture
        stopCamera();
      }
    }
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    startCamera();
  };

  const handleAspirantSelfieCaptured = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setCapturedPhoto(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const clearPhoto = () => {
    setCapturedPhoto(null);
  };



  const handleConfirmSelfie = async () => {
    if (!capturedPhoto) {
      setError(t('forms.aspirant.messages.noPhotoCaptured'));
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(capturedPhoto);
      const blob = await response.blob();
      const file = new File([blob], 'selfie.png', { type: 'image/png' });
      const aspirantId = (aspirantResp && aspirantResp.id) ? aspirantResp.id : (user?.aspirantId ?? null);
      let result: any = null;
      if (aspirantId) {
        result = await uploadAspirantDocument(Number(aspirantId), 'selfie', file);
      } else {
        result = await uploadProfilePicture(file);
      }

      setDocuments(prev => ({
        ...prev,
        photo: { name: 'selfie.png', size: blob.size || 0, uploaded: true, progress: 100 }
      }));
      setAspirantResp(result ?? aspirantResp);
      try {
        if (typeof fetchProfile === 'function') {
          await fetchProfile();
        }
      } catch (e) {
        // non-fatal
        console.warn('fetchProfile failed after selfie upload', e);
      }

      try {
        window.dispatchEvent(new CustomEvent('aspirant:documentUploaded', { detail: { documentType: aspirantId ? 'selfie' : 'profile-picture' } }));
      } catch (e) {
        // ignore
      }

      setError('');
      // Do not trigger the generic registration-success snackbar here —
      // confirming a selfie should not show "Aspirant registered" again.
      // Stop camera after successful upload
      stopCamera();
    } catch (err: any) {
      console.error('Profile picture upload failed', err?.response?.data || err);
      setError(err?.response?.data?.message || err?.message || t('forms.aspirant.messages.profilePictureUploadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRegistration = async (finalize = false) => {
    const values = watchedValues;

    setLoading(true);
    setError('');

    if (user?.aspirantId) {
      if (finalize) {
        setSuccessDialogOpen(true);
      } else {
        setActiveStep(2);
        window.scrollTo(0, 0);
      }
      setLoading(false);
      return;
    }

    const payload: AspirantPayload = {
      name: values.name,
      electionId: values.electionId !== undefined && values.electionId !== '' ? Number(values.electionId) : undefined,
      constituencyId: values.constituencyId !== undefined && values.constituencyId !== '' ? Number(values.constituencyId) : undefined,
      party: values.party,
      age: values.age !== undefined && values.age !== null && values.age !== '' ? Number(values.age) : undefined,
      address: values.address,
      education: values.education,
      occupation: values.occupation,
      gender: values.gender,
      phone: values.phone ?? '',
      manifesto: values.manifesto,
      instagramLink: values.instagramLink || null,
      facebookLink: values.facebookLink || null,
      linkedinLink: values.linkedinLink || null,
      twitterLink: values.twitterLink || null,
      whatsappNumber: values.whatsappNumber || null,
      identityBackground: answers[0] || '',
      resignationPledge: answers[1] || '',
      noHighCommand: answers[2] || '',
      technicalCompetence: answers[3] || '',
      transparency: answers[4] || '',
      emergencyProtocol: answers[5] || '',
      expertConsultation: answers[6] || '',
      voterFeedback: answers[7] || '',
      primaryRule: answers[8] || ''
    };

    console.info('Submitting aspirant payload:', payload);

    try {
      const resp = await registerAspirant(payload);
      const data = resp?.data ?? resp;

      setAspirantResp(data);
      try {
        await fetchProfile();
      } catch (e) {
        console.warn('fetchProfile after aspirant register failed', e);
      }
      setOpen(true);
      if (finalize) {
        setSuccessDialogOpen(true);
        try {
          const key = `aspirant_registration_complete_${user?.id ?? 'guest'}`;
          try { localStorage.setItem(key, 'true'); } catch (e) { /* ignore */ }
          try { localStorage.removeItem(DRAFT_KEY); } catch (e) { /* ignore */ }
        } catch (e) {
          // ignore
        }
      } else {
        setActiveStep(2);
        window.scrollTo(0, 0);
      }
    } catch (err: any) {
      console.error('Aspirant registration error response:', err?.response?.data || err);

      const backendMessage = err?.response?.data?.message || err?.response?.data || err?.message;
      const errorMessage = String(backendMessage || '').toLowerCase();

      if (
        (typeof errorMessage === 'string' && (errorMessage.toLowerCase().includes('user already has an aspirant') || errorMessage.toLowerCase().includes('already has an aspirant') || errorMessage.toLowerCase().includes('already has an aspirant record') || errorMessage.toLowerCase().includes('already has an aspirant'))) ||
        err?.response?.status === 400 && String(err?.response?.data || '').toLowerCase().includes('already')
      ) {
        try {
          await fetchProfile();
          const aspirantId = (user && (user as any).aspirantId) ?? (aspirantResp?.id ?? null);
          const globalUser = (window as unknown as { __user?: { aspirantId?: number | string } }).__user;
          if (!aspirantId && globalUser?.aspirantId) {
            const fallbackId = globalUser.aspirantId;
            if (fallbackId) {
              try {
                const resp = await getAspirantById(Number(fallbackId));
                setAspirantResp(resp?.data ?? resp);
              } catch (e) {
                // ignore
              }
            }
          }

          const updatedAspirantId = (user && (user as any).aspirantId) ?? aspirantResp?.id ?? null;
          if (updatedAspirantId) {
            try {
              const resp = await getAspirantById(Number(updatedAspirantId));
              setAspirantResp(resp?.data ?? resp);
            } catch (e) {
              console.warn('Failed to fetch aspirant after profile refresh', e);
            }
          }

          if (finalize) {
            setSuccessDialogOpen(true);
            try {
              const key = `aspirant_registration_complete_${user?.id ?? 'guest'}`;
              try { localStorage.setItem(key, 'true'); } catch (e) { /* ignore */ }
              try { localStorage.removeItem(DRAFT_KEY); } catch (e) { /* ignore */ }
            } catch (e) {
              // ignore
            }
          } else {
            setActiveStep(2);
            window.scrollTo(0, 0);
          }
          return;
        } catch (profileErr) {
          console.error('Error refreshing profile after duplicate aspirant error:', profileErr);
        }
      }

      setError(backendMessage || t('forms.aspirant.messages.submitFailed'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  const canProceedStep4 =
    documents.photo?.uploaded &&
    (documents.sopEn?.uploaded || documents.sopKn?.uploaded);
  const canProceedStep6 =
    declarationChecks.agreed &&
    digitalSignature.trim().length > 0 &&
    declarationPlace.trim().length > 0;

  return (
    <Stack spacing={3}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.1, color: theme.palette.text.primary, fontFamily: "'Baloo 2', sans-serif" }}>
            {t('forms.aspirant.title')}
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontFamily: "'Baloo 2', sans-serif" }}>
            {t('forms.aspirant.formSubtitle')}
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <form>
        {activeStep === 0 && (
          <DeclarationStep
            sopAgreed={sopAgreed}
            declarationChecks={declarationChecks}
            setDeclarationChecks={setDeclarationChecks}
            digitalSignature={digitalSignature}
            setDigitalSignature={setDigitalSignature}
            declarationPlace={declarationPlace}
            setDeclarationPlace={setDeclarationPlace}
            canProceed={canProceedStep6}
            loading={false}
            onBack={() => navigate(-1)}
            onSubmit={() => { setActiveStep(1); window.scrollTo(0, 0); }}
            onCancel={handleHome}
          />
        )}

        {activeStep === 1 && (
          <CandidateInformationStep
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
            trigger={trigger}
            setError={setFormError}
            clearErrors={clearErrors}
            reset={handleResetCandidateWritableFields}
            loading={loading}
            user={user}
            onNext={handleNext}
            onBack={handleBack}
            onCancel={handleHome}
          />
        )}

        {activeStep === 2 && (
          <DocumentsUploadStep
            documents={documents}
            setDocuments={setDocuments}
            handleFileUpload={handleFileUpload}
            onBack={handleBack}
            onNext={handleNext}
            onCancel={handleHome}
            canProceed={canProceedStep4}
            submitButtonText={t('forms.aspirant.navigation.submit')}
            cameraActive={cameraActive}
            capturedPhoto={capturedPhoto}
            loading={loading}
            videoRef={videoRef}
            canvasRef={canvasRef}
            startCamera={startCamera}
            stopCamera={stopCamera}
            capturePhoto={capturePhoto}
            retakePhoto={retakePhoto}
            handleConfirmSelfie={handleConfirmSelfie}
            onSelfieCaptured={handleAspirantSelfieCaptured}
            clearPhoto={clearPhoto}
            aspirantId={aspirantResp?.id ?? user?.aspirantId ?? null}
            onAspirantUpdated={async (result) => {
              try {
                // Update local aspirantResp and refresh profile in auth store
                if (result) {
                  setAspirantResp(result ?? aspirantResp);
                }
                try { await fetchProfile(); } catch (e) { /* non-fatal */ }
              } catch (e) { /* ignore */ }
            }}
          />
        )}
      </form>

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={error ? 'error' : 'success'} onClose={() => setOpen(false)}>
          {error || t('status.aspirantRegistered') || t('forms.aspirant.messages.applicationSubmitted')}
        </Alert>
      </Snackbar>

      <Dialog
        open={successDialogOpen}
        onClose={() => {
          setSuccessDialogOpen(false);
          reset();
          setActiveStep(0);
          navigate('/user/dashboard', { replace: true });
        }}
        maxWidth="sm"
        fullWidth
        BackdropProps={{
          sx: {
            backdropFilter: 'blur(6px)',
            background: 'rgba(0,0,0,0.74)',
          },
        }}
        PaperProps={{
          sx: {
            bgcolor: theme.palette.mode === 'dark' ? '#0A0808' : '#FFFFFF',
            color: theme.palette.text.primary,
            borderRadius: '16px',
            overflow: 'hidden',
            border: theme.palette.mode === 'dark' ? '1px solid rgba(245,168,0,0.22)' : '1px solid rgba(245,168,0,0.3)',
            boxShadow: theme.palette.mode === 'dark'
              ? '0 20px 70px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04) inset'
              : '0 20px 70px rgba(17,24,39,0.18), 0 0 0 1px rgba(15,23,42,0.04) inset',
            backgroundImage: theme.palette.mode === 'dark'
              ? 'linear-gradient(rgba(255,255,255,.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.012) 1px,transparent 1px)'
              : 'linear-gradient(rgba(17,24,39,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(17,24,39,.02) 1px,transparent 1px)',
            backgroundSize: '44px 44px',
          },
        }}
      >
        <Box sx={{ display: 'flex', height: '4px' }}>
          {['#C8180A', '#253A9A', '#6B3A00'].map(c => <Box key={c} sx={{ flex: 1, bgcolor: c }} />)}
        </Box>
        <DialogTitle sx={{ textAlign: 'center', pt: 4 }}>
          <Box
            sx={{
              width: 78,
              height: 78,
              borderRadius: '50%',
              mx: 'auto',
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg,rgba(200,24,10,0.22),rgba(245,168,0,0.16))',
              border: '1.5px solid rgba(245,168,0,0.45)',
              '@keyframes votePulse': {
                '0%,100%': { boxShadow: '0 0 0 0 rgba(245,168,0,0.0), 0 0 22px rgba(200,24,10,0.22)' },
                '50%': { boxShadow: '0 0 0 8px rgba(245,168,0,0.06), 0 0 34px rgba(245,168,0,0.35)' },
              },
              animation: 'votePulse 2.4s ease-in-out infinite',
            }}
          >
            <HowToVoteIcon sx={{ fontSize: 42, color: '#F5A800' }} />
          </Box>
          <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
            {t('forms.aspirant.successDialog.title')}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', pb: 2, px: { xs: 3, sm: 5 } }}>
          <Typography variant="body1" sx={{ mb: 1, color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.72)' : 'rgba(15,23,42,0.74)' }}>
            {t('forms.aspirant.successDialog.message')}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600, color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.88)' : 'rgba(15,23,42,0.9)' }}>
            {t('forms.aspirant.successDialog.thanks')}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            variant="contained"
            onClick={() => {
              setSuccessDialogOpen(false);
              reset();
              setActiveStep(0);
              navigate('/user/dashboard', { replace: true });
            }}
            sx={{
              px: 4,
              fontWeight: 800,
              color: '#fff',
              borderRadius: '10px',
              background: 'linear-gradient(135deg,#C8180A 0%,#F5A800 100%)',
              boxShadow: '0 8px 28px rgba(200,24,10,0.38)',
              '&:hover': {
                background: 'linear-gradient(135deg,#df210f 0%,#ffbe1a 100%)',
                boxShadow: '0 10px 34px rgba(200,24,10,0.52)',
              },
            }}
          >
            {t('common.ok')}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default AspirantRegistrationPage;
