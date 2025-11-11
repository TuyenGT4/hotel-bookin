import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next"; // ✅ thêm

export default function DeleteManageRoomCategoriesModal({
  open,
  onClose,
  member,
  onSuccess,
  loading,
  setLoading,
}) {
  const { t } = useTranslation(
    "component/dashboard/admin/manageroomcategories/DeleteManageCategoriesModal"
  ); // ✅ namespace

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.API}/admin/roomtype/${member._id}`,
        {
          method: "DELETE",
        }
      );

      onSuccess(member._id);
      toast.success(
        t("messages.delete_success", "Room type deleted successfully")
      );
    } catch (error) {
      toast.error(t("errors.delete_failed", "Failed to delete room type"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t("title", "Confirm Delete")}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t("confirm_text", {
            name: member?.name,
            defaultValue:
              "Are you sure you want to delete {{name}}? This action cannot be undone.",
          })}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" disabled={loading}>
          {t("buttons.cancel", "Cancel")}
        </Button>
        <Button
          onClick={handleDelete}
          color="error"
          variant="contained"
          disabled={loading}
          autoFocus
        >
          {loading
            ? t("buttons.deleting", "Deleting...")
            : t("buttons.delete", "Delete")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
