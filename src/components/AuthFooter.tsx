import React from "react";
import { Box, Link, Typography, useTheme } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BRAND } from "../theme";

const AuthFooter: React.FC = () => {
  const theme = useTheme();
  const { i18n } = useTranslation();
  const isDark = theme.palette.mode === "dark";
  const textColor = isDark ? "rgba(255,255,255,0.9)" : "rgba(17,24,39,0.9)";
  const muted = isDark ? "rgba(255,255,255,0.65)" : "rgba(55,65,81,0.7)";

  return (
    <Box
      component="footer"
      sx={{
        mt: 0,
        textAlign: "center",
        py: { xs: 1, sm: 1.25 },
        px: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 1.25,
          alignItems: "center",
          flexWrap: "wrap",
          mb: 0.5,
        }}
      >
        <Link
          component={RouterLink}
          to="/privacy-policy"
          underline="hover"
          sx={{
            color: isDark ? BRAND.yellow2 : BRAND.red,
            fontSize: "0.88rem",
            fontWeight: 600,
          }}
        >
          Privacy Policy
        </Link>
        <Box
          component="span"
          sx={{ color: BRAND.red, fontSize: "1.1rem", lineHeight: 1 }}
        >
          ·
        </Box>
        <Link
          component={RouterLink}
          to="/terms-and-conditions"
          underline="none"
          sx={{
            color: isDark ? BRAND.yellow2 : BRAND.red,
            fontSize: "0.88rem",
            fontWeight: 600,
          }}
        >
          Terms
        </Link>
        <Box
          component="span"
          sx={{ color: BRAND.red, fontSize: "1.1rem", lineHeight: 1 }}
        >
          ·
        </Box>
        <Link
          component={RouterLink}
          to="/community-guidelines"
          underline="none"
          sx={{
            color: isDark ? BRAND.yellow2 : BRAND.red,
            fontSize: "0.88rem",
            fontWeight: 600,
          }}
        >
          Community Guidelines
        </Link>
      </Box>
      <Typography sx={{ color: muted, fontSize: "0.75rem" }}>
        © Prajaakeeya {new Date().getFullYear()}
      </Typography>
    </Box>
  );
};

export default AuthFooter;
