import { ChangeEvent } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface FileUploadInputProps {
  label: string;
  multiple?: boolean;
  onChange: (files: FileList | null) => void;
  selectedNames: string[];
  disabled?: boolean;
  accept?: string;
}

const FileUploadInput = ({
  label,
  multiple = true,
  onChange,
  selectedNames,
  disabled = false,
  accept = 'application/pdf'
}: FileUploadInputProps) => (
  <Stack spacing={1}>
    <Button
      variant="outlined"
      startIcon={<CloudUploadIcon />}
      component="label"
      disabled={disabled}
      sx={{ alignSelf: 'flex-start' }}
    >
      {label}
      <input
        type="file"
        hidden
        multiple={multiple}
        accept={accept}
        disabled={disabled}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.files)}
      />
    </Button>
    {selectedNames.length > 0 && (
      <Typography variant="body2" color="text.secondary">
        {selectedNames.join(', ')}
      </Typography>
    )}
  </Stack>
);

export default FileUploadInput;
