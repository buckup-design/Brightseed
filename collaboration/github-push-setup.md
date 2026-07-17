# GitHub Push Access on a New Mac

*Internal. How to get a fresh machine able to push to `buckup-design/Brightseed`, not just clone. Pick ONE of the two routes below. The GitHub CLI route is simpler; the SSH route is the classic way. You don't need both.*

Why this is needed: cloning a public-ish repo can work without auth, but pushing always requires GitHub to know it's you. These steps set that up once per machine.

---

## Route A: GitHub CLI (recommended, simplest)

This handles authentication for you and wires up Git so pushes "just work."

### 1. Install the CLI

```bash
brew install gh
```

(If you don't have Homebrew, install it first from https://brew.sh, then run the line above.)

### 2. Log in

```bash
gh auth login
```

You'll get a series of prompts. Answer them like this:

- **What account do you want to log into?** → `GitHub.com`
- **What is your preferred protocol for Git operations?** → `HTTPS`
- **Authenticate Git with your GitHub credentials?** → `Yes`
- **How would you like to authenticate?** → `Login with a web browser`

It shows a one-time code (like `ABCD-1234`). Copy it, press Enter, and your browser opens. Paste the code, click **Authorize**, and return to the terminal. It should say you're logged in.

### 3. Confirm it worked

```bash
gh auth status
```

You should see your username and `Logged in to github.com`. That's it, pushing will now work.

### 4. Push test

From inside the repo:

```bash
cd Brightseed
git checkout -b setup-test
git commit --allow-empty -m "test push access"
git push -u origin setup-test
```

If that push succeeds, you're done. You can delete the test branch afterward (`git push origin --delete setup-test` and `git branch -D setup-test`).

---

## Route B: SSH key (the classic way)

Use this if you prefer SSH or already use SSH keys elsewhere.

### 1. Check for an existing key

```bash
ls -al ~/.ssh
```

If you see `id_ed25519.pub` (or `id_rsa.pub`), you already have one, skip to step 3.

### 2. Generate a new key

```bash
ssh-keygen -t ed25519 -C "your-github-email@example.com"
```

Press Enter to accept the default file location. You can set a passphrase or leave it blank (Enter twice).

### 3. Add the key to the ssh-agent (with macOS Keychain)

```bash
eval "$(ssh-agent -s)"
```

Create or edit `~/.ssh/config` and add:

```
Host github.com
  AddKeysToAgent yes
  UseKeychain yes
  IdentityFile ~/.ssh/id_ed25519
```

Then:

```bash
ssh-add --apple-use-keychain ~/.ssh/id_ed25519
```

### 4. Copy the public key

```bash
pbcopy < ~/.ssh/id_ed25519.pub
```

This puts the public key on your clipboard.

### 5. Add it to GitHub

Go to https://github.com/settings/keys → **New SSH key** → give it a title (e.g. "Becky MacBook 2") → paste into the Key field → **Add SSH key**.

### 6. Test the connection

```bash
ssh -T git@github.com
```

First time, type `yes` to trust the host. You should see:
`Hi <username>! You've successfully authenticated...`

### 7. Make sure the repo uses the SSH remote

If you cloned over HTTPS, switch the remote to SSH:

```bash
cd Brightseed
git remote set-url origin git@github.com:buckup-design/Brightseed.git
```

(If you haven't cloned yet, just clone with the SSH URL above instead of the HTTPS one.)

### 8. Push test

Same as Route A step 4.

---

## If a push gets rejected

- `Permission denied` / `403` → you're authenticated as the wrong account, or you haven't been added as a collaborator on `buckup-design/Brightseed`. (Ask Becky to add you as a collaborator.)
- `protected branch` / push to `main` rejected → that's intentional. `main` is protected; push a branch and open a PR instead.
- Still stuck → tell Claude the exact error text and we'll sort it.
