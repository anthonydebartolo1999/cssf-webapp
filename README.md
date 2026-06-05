# Cosenza Super Street Food - Sito e PWA

Sito evento e web app installabile per la 4a edizione del Cosenza Super Street
Food, impostata sulle date pubbliche 26, 27 e 28 giugno 2026 a Piazza Sacri
Cuori, Localita Gidora, Luzzi.

## Funzioni

- Hero pubblico con countdown, CTA e prompt installazione app.
- Mappa food truck interattiva con filtri per categoria e opzioni.
- Schede stand con menu, zona, stato e attesa stimata.
- Votazioni live Supabase per categorie con classifiche pubbliche aggregate e
  dettaglio staff.
- Modulo prenotazione tavoli con giorno, turno, persone, area preferita e note.
- Banner consenso analytics first-party.
- Tracciamento anonimo di sezioni viste, click, form e conversioni.
- Accesso admin demo con PIN `2606`.
- Dashboard statistiche con sessioni, eventi, click, sezioni viste e funnel.
- Capienza per turno modificabile dallo staff.
- Lista attesa automatica quando un turno supera la capienza.
- Cruscotto staff con ricerca, filtri, cambio stato, messaggio WhatsApp, copia
  scheda ed esportazione CSV.
- Food truck condivisi via Supabase con fallback locale per mappa, schede e
  votazioni.
- Sezione programma pronta per lineup, stand, sponsor e aggiornamenti live.
- Recensioni locali con valutazione, testo e media stelle.
- PWA con `manifest.webmanifest`, `service-worker.js`, icone PNG/SVG e cache
  offline dei file principali.

## Avvio

Per vedere il sito basta aprire `index.html` nel browser.

Per provare installazione PWA e service worker in locale serve un piccolo server:

```powershell
python -m http.server 8099 --bind 127.0.0.1
```

Poi apri `http://127.0.0.1:8099/index.html`.

## Note produzione

La versione attuale salva prenotazioni, food truck e voti su Supabase quando il
backend e le policy sono attivi; il browser mantiene una copia `localStorage`
come fallback/offline. Recensioni e analytics restano locali. Per il dominio
pubblico conviene completare il backend con:

- database condiviso anche per recensioni;
- login staff reale, non esposto nel frontend;
- moderazione recensioni;
- protezione anti-spam per votazioni;
- analytics aggregati server-side o piattaforma privacy-friendly;
- export centralizzato;
- privacy policy, informativa art. 13 GDPR e consenso trattamento dati ove necessario.

Le analytics demo sono first-party e salvate solo nel browser locale. Il Garante
Privacy indica che gli analytics possono essere assimilati ai tecnici solo se
usati per statistiche aggregate, su singolo sito/app e con adeguata informativa;
per usi piu invasivi serve consenso esplicito.

## Fonti usate

- Pagina Instagram pubblica: https://www.instagram.com/cosenzasuperstreetfood/
- Scheda evento Regione Calabria: https://calabriastraordinaria.it/eventi/cosenza-super-street-food
- Articoli locali 2025 usati per tono, stand e contesto storico:
  - https://www.cosenzapp.it/tre-giorni-di-festa-il-cosenza-super-street-food-conquista-tutti/
  - https://www.cosenzaduepuntozero.it/torna-nel-weekend-la-terza-edizione-del-cosenza-super-street-food-tutte-le-info/
