#!/usr/bin/env bash
# Builds both resumes into public/cv/ (run from the repo root: bash cv/build.sh).
set -euo pipefail
cd "$(dirname "$0")/.."
out=$(mktemp -d)
for name in joel-codja-cv joel-codja-cv-fr; do
  pdflatex -interaction=nonstopmode -halt-on-error -output-directory "$out" "cv/$name.tex" >/dev/null \
    || { tail -30 "$out/$name.log"; exit 1; }
  mkdir -p public/cv
  cp "$out/$name.pdf" "public/cv/$name.pdf"
  echo "public/cv/$name.pdf: $(pdfinfo "public/cv/$name.pdf" 2>/dev/null | grep Pages || echo built)"
done
rm -rf "$out"
