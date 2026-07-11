#!/usr/bin/env bash
#
# Install a skill from github.com/saadiqhorton/skills without cloning the whole repo.
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/saadiqhorton/skills/main/install.sh | bash -s -- workflow-selector
#   curl -fsSL https://raw.githubusercontent.com/saadiqhorton/skills/main/install.sh | bash -s -- agentic-dev/workflow-selector
#   ./install.sh --target ~/.cursor/skills workflow-selector
#   ./install.sh --list
#
set -euo pipefail

REPO="https://github.com/saadiqhorton/skills.git"
DEFAULT_REF="main"
DEFAULT_TARGET="${SKILLS_INSTALL_DIR:-$HOME/.claude/skills}"

REF="$DEFAULT_REF"
TARGET="$DEFAULT_TARGET"
SKILL_ARG=""
LIST_ONLY=0
DRY_RUN=0

usage() {
  cat <<'EOF'
Install a skill from saadiqhorton/skills without cloning the whole repo.

Usage:
  install.sh [options] <skill>
  install.sh --list

Arguments:
  <skill>                 Skill name (e.g. workflow-selector) or path (agentic-dev/workflow-selector)

Options:
  --list                  List available skills
  --target <dir>          Install directory (default: ~/.claude/skills)
  --ref <branch|tag>      Git ref to install from (default: main)
  --dry-run               Show what would be installed without copying files
  -h, --help              Show this help

Examples:
  curl -fsSL https://raw.githubusercontent.com/saadiqhorton/skills/main/install.sh | bash -s -- workflow-selector
  curl -fsSL https://raw.githubusercontent.com/saadiqhorton/skills/main/install.sh | bash -s -- --target ~/.cursor/skills corigin-mapreduce
  ./install.sh --list
EOF
}

log() {
  printf '==> %s\n' "$*"
}

die() {
  printf 'error: %s\n' "$*" >&2
  exit 1
}

need_cmd() {
  command -v "$1" >/dev/null 2>&1 || die "missing required command: $1"
}

expand_home() {
  local path="$1"
  if [[ "$path" == "~/"* ]]; then
    printf '%s/%s' "$HOME" "${path#~/}"
  elif [[ "$path" == "~" ]]; then
    printf '%s' "$HOME"
  else
    printf '%s' "$path"
  fi
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --list)
      LIST_ONLY=1
      shift
      ;;
    --target)
      [[ $# -ge 2 ]] || die "--target requires a directory"
      TARGET="$(expand_home "$2")"
      shift 2
      ;;
    --ref)
      [[ $# -ge 2 ]] || die "--ref requires a branch or tag"
      REF="$2"
      shift 2
      ;;
    --dry-run)
      DRY_RUN=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    --)
      shift
      break
      ;;
    -*)
      die "unknown option: $1 (run with --help)"
      ;;
    *)
      [[ -z "$SKILL_ARG" ]] || die "unexpected extra argument: $1"
      SKILL_ARG="$1"
      shift
      ;;
  esac
done

if [[ $# -gt 0 ]]; then
  [[ -z "$SKILL_ARG" ]] || die "unexpected extra argument: $1"
  SKILL_ARG="$1"
fi

need_cmd git

TMPDIR="${TMPDIR:-/tmp}"
WORKDIR="$(mktemp -d "${TMPDIR%/}/skills-install.XXXXXX")"
REPO_DIR="$WORKDIR/repo"
cleanup() {
  rm -rf "$WORKDIR"
}
trap cleanup EXIT

ensure_repo_index() {
  [[ -d "$REPO_DIR/.git" ]] && return 0
  git clone --depth 1 --filter=blob:none --sparse "$REPO" "$REPO_DIR" >/dev/null 2>&1 \
    || die "failed to clone $REPO (is git installed and network available?)"
  (
    cd "$REPO_DIR"
    git checkout "$REF" >/dev/null 2>&1 \
      || die "ref not found: $REF"
  )
}

fetch_skill_paths() {
  ensure_repo_index
  (
    cd "$REPO_DIR"
    git ls-tree -r HEAD --name-only | grep '/SKILL.md$' | sed 's/\/SKILL.md$//' | sort
  )
}

checkout_skill() {
  local sparse_path="$1"
  (
    cd "$REPO_DIR"
    git sparse-checkout set "$sparse_path" >/dev/null 2>&1 \
      || die "path not found: $sparse_path"
  )
}

resolve_skill_path() {
  local input="$1"
  local skill_path=""
  local skill_name=""
  local matches=()
  local path

  if [[ "$input" == */* ]]; then
    skill_path="${input%/}"
    while IFS= read -r path; do
      [[ "$path" == "$skill_path" ]] && printf '%s\n' "$skill_path" && return
    done < <(fetch_skill_paths)
    die "skill not found: $skill_path (run with --list to see available skills)"
  fi

  skill_name="$input"
  while IFS= read -r path; do
    if [[ "$(basename "$path")" == "$skill_name" ]]; then
      matches+=("$path")
    fi
  done < <(fetch_skill_paths)

  if [[ ${#matches[@]} -eq 0 ]]; then
    die "skill not found: $skill_name (run with --list to see available skills)"
  fi

  if [[ ${#matches[@]} -gt 1 ]]; then
    die "ambiguous skill name '$skill_name'. Use the full path instead: ${matches[*]}"
  fi

  printf '%s\n' "${matches[0]}"
}

list_skills() {
  log "Available skills (ref: $REF):"
  while IFS= read -r skill_path; do
    printf '  %s\n' "$skill_path"
  done < <(fetch_skill_paths)
}

if [[ "$LIST_ONLY" -eq 1 ]]; then
  list_skills
  exit 0
fi

[[ -n "$SKILL_ARG" ]] || {
  usage >&2
  die "missing skill argument"
}

SKILL_PATH="$(resolve_skill_path "$SKILL_ARG")"
SKILL_NAME="$(basename "$SKILL_PATH")"
DEST_DIR="$TARGET/$SKILL_NAME"

log "Skill: $SKILL_PATH"
log "Source ref: $REF"
log "Destination: $DEST_DIR"

if [[ "$DRY_RUN" -eq 1 ]]; then
  log "Dry run — no files copied."
  exit 0
fi

log "Downloading skill (sparse checkout)..."
checkout_skill "$SKILL_PATH"
SOURCE_DIR="$REPO_DIR/$SKILL_PATH"

[[ -d "$SOURCE_DIR" ]] || die "download failed: $SKILL_PATH"

mkdir -p "$TARGET"

if [[ -e "$DEST_DIR" ]]; then
  die "destination already exists: $DEST_DIR (remove it first or pick another --target)"
fi

cp -R "$SOURCE_DIR" "$DEST_DIR"
log "Installed to $DEST_DIR"

VALIDATOR="$DEST_DIR/scripts/validate.py"
if [[ -f "$VALIDATOR" ]]; then
  if command -v python3 >/dev/null 2>&1; then
    log "Running validator..."
    python3 "$VALIDATOR"
  else
    log "Skipped validator (python3 not found). Run manually: python3 $VALIDATOR"
  fi
fi

log "Done."
