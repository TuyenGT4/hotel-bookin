import { useState, useEffect } from "react";
import { Grid, TextField, MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next"; // ✅ thêm i18n

const countries = ["Viet Nam"];

const BillingDetails = ({ onBillingDetailsChange }) => {
  const { t } = useTranslation("component/checkout/BillingDetails"); // ✅ thêm i18n
  const [formData, setFormData] = useState({
    country: "India",
    name: "",
    email: "",
    phone: "",
    address: "",
    state: "",
    zipCode: "",
  });

  const [errors, setErrors] = useState({
    name: { isError: false, message: "" },
    email: { isError: false, message: "" },
    phone: { isError: false, message: "" },
    address: { isError: false, message: "" },
    state: { isError: false, message: "" },
    zipCode: { isError: false, message: "" },
  });

  const [isTouched, setIsTouched] = useState({
    name: false,
    email: false,
    phone: false,
    address: "",
    state: "",
    zipCode: "",
  });

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        return value.trim() === ""
          ? t("name_required", "Name is required")
          : "";
      case "email":
        if (value.trim() === "")
          return t("email_required", "Email is required");
        if (!validateEmail(value))
          return t("email_invalid", "Please enter a valid email");
        return "";
      case "phone":
        return value.trim() === ""
          ? t("phone_required", "Phone is required")
          : "";
      case "address":
        return value.trim() === ""
          ? t("address_required", "Address is required")
          : "";
      case "state":
        return value.trim() === ""
          ? t("state_required", "State is required")
          : "";
      case "zipCode":
        return value.trim() === ""
          ? t("zipcode_required", "Zip Code is required")
          : "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    setIsTouched((prev) => ({ ...prev, [name]: true }));

    const errorMessage = validateField(name, value);

    setErrors((prev) => ({
      ...prev,
      [name]: {
        isError: !!errorMessage,
        message: errorMessage,
      },
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    const errorMessage = validateField(name, value);

    setErrors((prev) => ({
      ...prev,
      [name]: {
        isError: !!errorMessage,
        message: errorMessage,
      },
    }));
  };

  const validateForm = () => {
    let isValid = true;

    const newErrors = { ...errors };

    Object.keys(formData).forEach((key) => {
      if (key !== "country") {
        const errorMessage = validateField(key, formData[key]);

        newErrors[key] = {
          isError: !!errorMessage,
          message: errorMessage,
        };

        if (errorMessage) isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  useEffect(() => {
    if (onBillingDetailsChange) {
      onBillingDetailsChange({
        data: formData,
        isValid: validateForm(),
      });
    }
  }, [formData]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          select
          fullWidth
          label={t("country", "Country")}
          name="country"
          value={formData.country}
          onChange={handleChange}
        >
          {countries.map((country) => (
            <MenuItem key={country} value={country}>
              {country}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label={`${t("name", "Name")} *`}
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.name.isError}
          helperText={errors.name.message}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label={`${t("email", "Email")} *`}
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.email.isError}
          helperText={errors.email.message}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label={`${t("phone", "Phone")} *`}
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.phone.isError}
          helperText={errors.phone.message}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label={`${t("address", "Address")} *`}
          name="address"
          value={formData.address}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.address.isError}
          helperText={errors.address.message}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label={`${t("state", "State")} *`}
          name="state"
          value={formData.state}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.state.isError}
          helperText={errors.state.message}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label={`${t("zip_code", "Zip Code")} *`}
          name="zipCode"
          value={formData.zipCode}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.zipCode.isError}
          helperText={errors.zipCode.message}
        />
      </Grid>
    </Grid>
  );
};

export default BillingDetails;
