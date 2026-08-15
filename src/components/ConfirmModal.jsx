import React from "react";
import "../styles/confirmModal.css";

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isConfirming,
  onConfirm,
  onCancel,
}) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="modal-backdrop"
      onClick={!isConfirming ? onCancel : undefined}
    >
      <div
        className="modal-dialog"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <h2>{title}</h2>

        <p>{message}</p>

        <div className="form-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={onCancel}
            disabled={isConfirming}
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            className="danger-button"
            onClick={onConfirm}
            disabled={isConfirming}
          >
            {isConfirming ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}