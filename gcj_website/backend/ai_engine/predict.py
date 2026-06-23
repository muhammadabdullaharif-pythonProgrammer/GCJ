"""Prediction utilities for ai_engine.

The views import `predict_admission` from this module.
Some generated versions of the repo were missing this file, which breaks
Django checks/migrations (URL resolver imports the view).

This implementation keeps the server working by providing a safe fallback.
"""

from __future__ import annotations

from typing import Any, Dict


def predict_admission(student_data: Dict[str, Any]) -> Dict[str, Any]:
    """Return an eligibility/advice prediction.

    In the full system this may call a trained model and/or external LLM.
    For local dev (and to keep migrations runnable), we return a deterministic
    rules-based fallback.
    """

    # Basic heuristic: average marks => probability.
    matric = student_data.get("matric_marks")
    inter = student_data.get("inter_marks")

    try:
        matric_f = float(matric) if matric is not None else 0.0
        inter_f = float(inter) if inter is not None else 0.0
    except (TypeError, ValueError):
        matric_f = 0.0
        inter_f = 0.0

    score = (matric_f + inter_f) / 2.0

    # Map score into [0.05, 0.95]
    probability = max(0.05, min(0.95, score / 200.0 + 0.25))

    eligible = probability >= 0.6

    if eligible:
        advice = "Eligibility seems likely based on submitted marks. You should pursue the selected program and strengthen your portfolio."
    else:
        advice = "Eligibility is uncertain. Consider improving your marks/subject preparation and re-submit with updated information."

    return {
        "eligible": eligible,
        "probability": probability,
        "advice": advice,
        "model": "rules-fallback",
    }

