"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { PASSCODE } from "@/constants/passcode";

const DIGITS = PASSCODE.length;

export function PasscodeDialog({ open, onOpenChange, onConfirm }) {
  const [digits, setDigits] = useState(() => Array(DIGITS).fill(""));
  const [error, setError] = useState(false);
  const refs = useRef([]);

  const focus = useCallback((i) => {
    refs.current[i]?.focus();
    refs.current[i]?.select();
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const next = value.slice(-1);
    setDigits((prev) => {
      const copy = [...prev];
      copy[index] = next;
      return copy;
    });
    setError(false);
    if (next && index < DIGITS - 1) {
      focus(index + 1);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      focus(index - 1);
    }
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, DIGITS);
    if (!pasted) return;
    const next = Array(DIGITS).fill("");
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setDigits(next);
    setError(false);
    const focusIdx = Math.min(pasted.length, DIGITS - 1);
    focus(focusIdx);
  };

  const handleSubmit = () => {
    const code = digits.join("");
    if (code.length < DIGITS) return;
    if (code === PASSCODE) {
      onConfirm();
      handleClose();
    } else {
      setError(true);
      setDigits(Array(DIGITS).fill(""));
      focus(0);
    }
  };

  const handleClose = () => {
    setDigits(Array(DIGITS).fill(""));
    setError(false);
    onOpenChange(false);
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleClose}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content asChild>
          <motion.div
            className="z-[60] my-4 w-[min(92vw,360px)] rounded-xl bg-surface p-6 shadow-hover focus:outline-none"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.15 }}
          >
            <DialogPrimitive.Title className="text-center text-base font-semibold">
              Enter passcode
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="mt-1 text-center text-sm text-muted-foreground">
              Type the {DIGITS}-digit code to confirm deletion.
            </DialogPrimitive.Description>

            <div className="mt-5 flex justify-center gap-2" onPaste={handlePaste}>
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => { refs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onFocus={(e) => e.target.select()}
                  className={cn(
                    "h-11 w-10 text-center text-lg font-semibold tracking-widest rounded-lg bg-secondary/50 transition-colors focus:outline-none focus:ring-2",
                    error ? "ring-error focus:ring-error" : "focus:ring-ring"
                  )}
                />
              ))}
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="mt-3 text-center text-xs text-error"
                >
                  Wrong passcode. Try again.
                </motion.p>
              )}
            </AnimatePresence>

            <div className="mt-5 flex justify-end gap-2">
              <DialogPrimitive.Close asChild>
                <button
                  type="button"
                  className="rounded-lg px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
              </DialogPrimitive.Close>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={digits.join("").length < DIGITS}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors disabled:pointer-events-none disabled:opacity-50"
              >
                Confirm
              </button>
            </div>

            <DialogPrimitive.Close
              className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </DialogPrimitive.Close>
          </motion.div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
