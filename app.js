// Hauptkomponente für die Kalkulationsübung
const KalkulationUebung = () => {

    // Initialer Zustand für die Vorgabewerte
    const initialVorgaben = {
        kalk1: {
            listeneinkaufspreis: 2000.00,
            lieferantenrabatt_prozent: 8.00,
            lieferantenskonto_prozent: 3.00,
            selbstkosten: 3000.00,
            gewinn_prozent: 10.00,
            kundenskonto_prozent: 2.00,
            kundenrabatt_prozent: 5.00
        },
        kalk2: {
            selbstkosten: 6076.00,
            handlungskosten: 380.00,
            lieferantenrabatt_prozent: 8.50,
            lieferantenskonto_prozent: 5.00,
            gewinn_prozent: 5.00,
            kundenskonto_prozent: 2.00,
            kundenrabatt_prozent: 7.00,
            listenverkaufspreis: 7000.00
        },
        kalk3: {
            lieferantenrabatt_prozent: 20.00,
            lieferantenrabatt: 360.00,
            lieferantenskonto_prozent: 2.00,
            gewinn: 180.00,
            barverkaufspreis: 1650.00,
            zielverkaufspreis: 1740.00,
            kundenskonto: 90.00,
            listenverkaufspreis: 1800.00
        }
    };

    // State-Hooks korrekt initialisieren
    const [vorgaben, setVorgaben] = React.useState(initialVorgaben);
    const [userInputs, setUserInputs] = React.useState({
        kalk1: {},
        kalk2: {},
        kalk3: {}
    });

    // Berechnet die korrekten Werte für die Validierung der Eingaben
    const berechneKorrekt = (kalk, vorgabe) => {
        // Kalkulation 1 - Vorwärtsrechnung vom Listeneinkaufspreis
        if (kalk === 'kalk1') {
            const lieferantenrabatt = vorgabe.listeneinkaufspreis * (vorgabe.lieferantenrabatt_prozent / 100);
            const rechnungspreis = vorgabe.listeneinkaufspreis - lieferantenrabatt;
            const lieferantenskonto = rechnungspreis * (vorgabe.lieferantenskonto_prozent / 100);
            const bareinkaufspreis = rechnungspreis - lieferantenskonto;
            const handlungskosten = vorgabe.selbstkosten - bareinkaufspreis;
            const gewinn = vorgabe.selbstkosten * (vorgabe.gewinn_prozent / 100);
            const barverkaufspreis = vorgabe.selbstkosten + gewinn;
            const zielverkaufspreis = barverkaufspreis / (1 - vorgabe.kundenskonto_prozent / 100);
            const kundenskonto = zielverkaufspreis * (vorgabe.kundenskonto_prozent / 100);
            const listenverkaufspreis = zielverkaufspreis / (1 - vorgabe.kundenrabatt_prozent / 100);
            const kundenrabatt = listenverkaufspreis - zielverkaufspreis;

            return {
                lieferantenrabatt,
                rechnungspreis,
                lieferantenskonto,
                bareinkaufspreis,
                handlungskosten,
                gewinn,
                barverkaufspreis,
                kundenskonto,
                zielverkaufspreis,
                kundenrabatt,
                listenverkaufspreis
            };
        }
        
        // Kalkulation 2 - Rückwärtsrechnung von Selbstkosten und Handlungskosten
        if (kalk === 'kalk2') {
            const bareinkaufspreis = vorgabe.selbstkosten - vorgabe.handlungskosten;
            const rechnungspreis = bareinkaufspreis / (1 - vorgabe.lieferantenskonto_prozent / 100);
            const lieferantenskonto = rechnungspreis * (vorgabe.lieferantenskonto_prozent / 100);
            const listeneinkaufspreis = rechnungspreis / (1 - vorgabe.lieferantenrabatt_prozent / 100);
            const lieferantenrabatt = listeneinkaufspreis * (vorgabe.lieferantenrabatt_prozent / 100);
            const gewinn = vorgabe.selbstkosten * (vorgabe.gewinn_prozent / 100);
            const barverkaufspreis = vorgabe.selbstkosten + gewinn;
            const zielverkaufspreis = barverkaufspreis / (1 - vorgabe.kundenskonto_prozent / 100);
            const kundenskonto = zielverkaufspreis * (vorgabe.kundenskonto_prozent / 100);
            const kundenrabatt = vorgabe.listenverkaufspreis - zielverkaufspreis;
            // Listenverkaufspreis ist bereits gegeben

            return {
                listeneinkaufspreis,
                lieferantenrabatt,
                rechnungspreis,
                lieferantenskonto,
                bareinkaufspreis,
                gewinn,
                barverkaufspreis,
                kundenskonto,
                zielverkaufspreis,
                kundenrabatt
            };
        }

        // Kalkulation 3 - Gemischte Vorgaben
        if (kalk === 'kalk3') {
            // Rückwärtsrechnung vom gegebenen Lieferantenrabatt
            const listeneinkaufspreis = (vorgabe.lieferantenrabatt / vorgabe.lieferantenrabatt_prozent) * 100;
            const rechnungspreis = listeneinkaufspreis - vorgabe.lieferantenrabatt;
            const lieferantenskonto = rechnungspreis * (vorgabe.lieferantenskonto_prozent / 100);
            const bareinkaufspreis = rechnungspreis - lieferantenskonto;
            const selbstkosten = vorgabe.barverkaufspreis - vorgabe.gewinn;
            const handlungskosten = selbstkosten - bareinkaufspreis;
            const gewinn_prozent = (vorgabe.gewinn / selbstkosten) * 100;
            const kundenskonto_prozent = (vorgabe.kundenskonto / vorgabe.zielverkaufspreis) * 100;
            const kundenrabatt = vorgabe.listenverkaufspreis - vorgabe.zielverkaufspreis;
            const kundenrabatt_prozent = (kundenrabatt / vorgabe.listenverkaufspreis) * 100;

            return {
                listeneinkaufspreis,
                rechnungspreis,
                lieferantenskonto,
                bareinkaufspreis,
                handlungskosten,
                selbstkosten,
                gewinn_prozent,
                kundenskonto_prozent,
                kundenrabatt,
                kundenrabatt_prozent
            };
        }

        return {};
    };

    // Validiert die Benutzereingaben mit einer Toleranz von 0.05
    const pruefeEingabe = (wert, korrekt) => {
        if (!wert || typeof korrekt === 'undefined') return '';
        const eingabe = parseFloat(wert);
        const diff = Math.abs(eingabe - korrekt);
        return diff <= 0.05 ? 'bg-green-100' : 'bg-red-100';
    };

    // Handler für Benutzereingaben
    const handleChange = (kalk, feld, wert) => {
        setUserInputs(prev => ({
            ...prev,
            [kalk]: {
                ...prev[kalk],
                [feld]: wert
            }
        }));
    };

    // Diese Funktion generiert eine einzelne Zufallszahl mit festgelegter Genauigkeit
    const zufallsZahl = (min, max, dezimalstellen = 2) => {
        // Wir verwenden toFixed für eine konstante Anzahl von Dezimalstellen
        // und parseFloat, um führende Nullen zu entfernen
        return parseFloat((Math.random() * (max - min) + min).toFixed(dezimalstellen));
    };

    // Diese Funktion generiert einen kompletten Satz von zusammenhängenden Zufallswerten
    const generiereZufallsKalkulation = () => {
        // Kalkulation 1: Vorwärtsrechnung
        const k1 = {
            listeneinkaufspreis: zufallsZahl(1500, 3000),
            lieferantenrabatt_prozent: zufallsZahl(5, 12),
            lieferantenskonto_prozent: zufallsZahl(2, 4)
        };
        // Berechnen der abhängigen Werte für realistische Verhältnisse
        k1.selbstkosten = k1.listeneinkaufspreis * (1 - k1.lieferantenrabatt_prozent/100) * 
                        (1 - k1.lieferantenskonto_prozent/100) * 1.4; // 40% Aufschlag
        k1.gewinn_prozent = zufallsZahl(8, 15);
        k1.kundenskonto_prozent = zufallsZahl(2, 3);
        k1.kundenrabatt_prozent = zufallsZahl(3, 7);

        // Kalkulation 2: Rückwärtsrechnung
        const k2 = {
            selbstkosten: zufallsZahl(5000, 7000),
            handlungskosten: null, // Wird gleich berechnet
            lieferantenrabatt_prozent: zufallsZahl(5, 12),
            lieferantenskonto_prozent: zufallsZahl(2, 4),
            gewinn_prozent: zufallsZahl(8, 15),
            kundenskonto_prozent: zufallsZahl(2, 3),
            kundenrabatt_prozent: zufallsZahl(3, 7)
        };
        k2.handlungskosten = k2.selbstkosten * 0.15; // 15% der Selbstkosten
        k2.listenverkaufspreis = k2.selbstkosten * 1.3; // 30% Aufschlag

        // Kalkulation 3: Gemischte Vorgaben
        const k3 = {
            lieferantenrabatt_prozent: zufallsZahl(15, 25)
        };
        const basispreis = zufallsZahl(1500, 2500);
        k3.lieferantenrabatt = basispreis * (k3.lieferantenrabatt_prozent/100);
        k3.lieferantenskonto_prozent = zufallsZahl(2, 4);
        k3.barverkaufspreis = basispreis * 1.2;
        k3.zielverkaufspreis = k3.barverkaufspreis * 1.1;
        k3.gewinn = k3.barverkaufspreis * 0.15;
        k3.kundenskonto = k3.zielverkaufspreis * 0.05;
        k3.listenverkaufspreis = k3.zielverkaufspreis * 1.1;

        return {
            kalk1: k1,
            kalk2: k2,
            kalk3: k3
        };
    };

    // Der Button-Handler muss explizit die neuen Werte setzen und die Eingaben zurücksetzen
    const handleNeueZahlen = () => {
        const neueZahlen = generiereZufallsKalkulation();
        setVorgaben(neueZahlen);
        setUserInputs({ kalk1: {}, kalk2: {}, kalk3: {} });
    };

    // Rendert eine einzelne Tabellenzeile
    const renderZeile = (label, prozentFeld, betragFeld) => (
        <tr>
            <td className="border p-2 font-medium">{label}</td>
            {['kalk1', 'kalk2', 'kalk3'].map((kalk) => (
                <React.Fragment key={`${kalk}-${betragFeld}`}>
                    <td className="border p-2 w-32">
                        {prozentFeld && vorgaben[kalk][prozentFeld] !== undefined && (
                            <div className="yellow-bg p-1 rounded">
                                {vorgaben[kalk][prozentFeld].toFixed(2)}%
                            </div>
                        )}
                        {prozentFeld && vorgaben[kalk][prozentFeld] === undefined && (
                            <input
                                type="number"
                                step="0.01"
                                className="input-field"
                                value={userInputs[kalk][prozentFeld] || ''}
                                onChange={(e) => handleChange(kalk, prozentFeld, e.target.value)}
                                placeholder="%"
                            />
                        )}
                    </td>
                    <td className="border p-2 w-32">
                        {vorgaben[kalk][betragFeld] !== undefined ? (
                            <div className="yellow-bg p-1 rounded">
                                {vorgaben[kalk][betragFeld].toFixed(2)} €
                            </div>
                        ) : (
                            <input
                                type="number"
                                step="0.01"
                                className={`input-field ${
                                    userInputs[kalk][betragFeld] ? 
                                        pruefeEingabe(userInputs[kalk][betragFeld], 
                                            berechneKorrekt(kalk, vorgaben[kalk])[betragFeld]) : 
                                        ''
                                }`}
                                value={userInputs[kalk][betragFeld] || ''}
                                onChange={(e) => handleChange(kalk, betragFeld, e.target.value)}
                                placeholder="€"
                            />
                        )}
                    </td>
                </React.Fragment>
            ))}
        </tr>
    );

    // Render der Hauptkomponente
    return (
        <div className="max-w-7xl mx-auto p-4">
            <button
                onClick={handleNeueZahlen}
                className="button-primary mb-4"
            >
                Neue Zufallszahlen generieren
            </button>
            <div className="table-container">
                <table className="kalkulation-table">
                    <thead>
                        <tr>
                            <th className="border p-2 w-48"></th>
                            <th className="border p-2 text-center" colSpan="2">Kalkulation 1</th>
                            <th className="border p-2 text-center" colSpan="2">Kalkulation 2</th>
                            <th className="border p-2 text-center" colSpan="2">Kalkulation 3</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderZeile('Listeneinkaufspreis', null, 'listeneinkaufspreis')}
                        {renderZeile('Lieferantenrabatt', 'lieferantenrabatt_prozent', 'lieferantenrabatt')}
                        {renderZeile('= Rechnungspreis', null, 'rechnungspreis')}
                        {renderZeile('Lieferantenskonto', 'lieferantenskonto_prozent', 'lieferantenskonto')}
                        {renderZeile('= Bareinkaufspreis', null, 'bareinkaufspreis')}
                        {renderZeile('Handlungskosten', null, 'handlungskosten')}
                        {renderZeile('= Selbstkosten', null, 'selbstkosten')}
                        {renderZeile('Gewinn', 'gewinn_prozent', 'gewinn')}
                        {renderZeile('= Barverkaufspreis', null, 'barverkaufspreis')}
                        {renderZeile('Kundenskonto', 'kundenskonto_prozent', 'kundenskonto')}
                        {renderZeile('= Zielverkaufspreis', null, 'zielverkaufspreis')}
                        {renderZeile('Kundenrabatt', 'kundenrabatt_prozent', 'kundenrabatt')}
                        {renderZeile('= Listenverkaufspreis', null, 'listenverkaufspreis')}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Die Komponente im DOM rendern
ReactDOM.render(<KalkulationUebung />, document.getElementById('root'));