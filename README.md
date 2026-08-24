# Mistrzowie Logiki

Dwujęzyczna strona internetowa zajęć z matematyki i szachów, zbudowana w React, TypeScript, Vite i Tailwind CSS.

## Uruchomienie projektu od zera

### Wymagania

- Node.js 20 LTS lub nowszy
- npm (instalowany razem z Node.js)
- Git

### 1. Pobierz repozytorium

```bash
git clone git@github.com:PiotrStachowicz/MistrzowieLogiki.git
cd MistrzowieLogiki
```

Możesz również użyć adresu HTTPS:

```bash
git clone https://github.com/PiotrStachowicz/MistrzowieLogiki.git
cd MistrzowieLogiki
```

### 2. Zainstaluj zależności

```bash
npm ci
```

`npm ci` korzysta z `package-lock.json`, dzięki czemu instaluje dokładnie te wersje zależności, które są zapisane w repozytorium.

### 3. Przygotuj zmienne środowiskowe

W PowerShell:

```powershell
Copy-Item .env.example .env.local
```

W systemie macOS lub Linux:

```bash
cp .env.example .env.local
```

Do samego wyświetlenia strony lokalnie nie trzeba uzupełniać danych EmailJS. Są one potrzebne do działania formularza zapisu wysyłającego wiadomości.

Dostępne zmienne:

- `EMAILJS_PUBLIC_KEY` – klucz publiczny EmailJS,
- `EMAILJS_SERVICE_ID` – identyfikator usługi EmailJS,
- `EMAILJS_OWNER_TEMPLATE_ID` – szablon wiadomości dla właściciela,
- `EMAILJS_CUSTOMER_TEMPLATE_ID` – polski szablon potwierdzenia dla klienta,
- `EMAILJS_CUSTOMER_TEMPLATE_ID_EN` – opcjonalny angielski szablon potwierdzenia,
- `VITE_SITE_URL` – docelowy adres strony używany w metadanych i linkach kanonicznych.

Nie commituj pliku `.env.local` ani prawdziwych kluczy. Plik jest ignorowany przez Git.

### 4. Uruchom stronę lokalnie

```bash
npm run dev
```

Strona będzie dostępna pod adresem:

```text
http://localhost:5173
```

Angielska wersja zaczyna się od ścieżki `/en`, na przykład:

```text
http://localhost:5173/en
```

## Formularz zapisu i lokalne API

Polecenie `npm run dev` uruchamia frontend Vite. Endpoint formularza znajduje się w `api/send-registration.ts` i jest funkcją serwerową przeznaczoną dla Vercel.

Aby lokalnie sprawdzić również wysyłanie formularza, uzupełnij `.env.local`, a następnie uruchom projekt przez Vercel CLI:

```bash
npx vercel dev
```

Przed testem upewnij się, że używane konto EmailJS ma skonfigurowane wskazane usługi i szablony.

## Build produkcyjny

```bash
npm run build
```

Polecenie najpierw wykonuje kontrolę typów, a następnie zapisuje gotową stronę w katalogu `dist`.

Lokalny podgląd gotowego buildu:

```bash
npm run preview
```

## Przydatne komendy

```bash
npm run dev        # serwer developerski
npm run typecheck  # kontrola typów TypeScript
npm run lint       # kontrola ESLint
npm run build      # build produkcyjny
npm run preview    # podgląd buildu z katalogu dist
```

## Najczęstsze problemy

### Port 5173 jest zajęty

Vite wybierze kolejny wolny port i pokaże jego adres w terminalu. Możesz też wskazać port ręcznie:

```bash
npm run dev -- --port 5174
```

### Zależności zachowują się nieprawidłowo

Usuń katalog `node_modules` i ponownie uruchom:

```bash
npm ci
```

### Formularz zwraca błąd podczas `npm run dev`

To oczekiwane, jeśli uruchomiony jest wyłącznie frontend Vite. Do testowania endpointu `/api/send-registration` użyj `npx vercel dev` oraz prawidłowych zmiennych EmailJS.
