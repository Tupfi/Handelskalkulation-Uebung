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

    // State-Hooks für Vorgaben und Benutzereingaben
    const [vorgaben, setVorgaben] = React.useState(initialVorgaben);
    const [userInputs, setUserInputs] = React.useState({
        kalk1: {},
        kalk2: {},
        kalk3: {}
    });

    // Funktion zum Testen der mathematischen Beziehungen
    const testeKalkulationsLogik = (kalkulation) => {
        console.log("=== Teste Kalkulationslogik ===");
        
        // Test für Kalkulation 1
        const k1 = kalkulation.kalk1;
        console.log("Kalkulation 1 Tests:");
        const k1_rabatt = k1.listeneinkaufspreis * (k1.lieferantenrabatt_prozent / 100);
        console.log("Lieferantenrabatt korrekt:", Math.abs(k1_rabatt - k1.lieferantenrabatt) < 0.01);
    
        // Test für Kalkulation 2
        const k2 = kalkulation.kalk2;
        console.log("\nKalkulation 2 Tests:");
        const k2_bareinkauf = k2.selbstkosten - k2.handlungskosten;
        console.log("Selbstkosten korrekt:", Math.abs((k2_bareinkauf + k2.handlungskosten) - k2.selbstkosten) < 0.01);
    
        // Test für Kalkulation 3
        const k3 = kalkulation.kalk3;
        console.log("\nKalkulation 3 Tests:");
        const k3_rabatt_berechnet = k3.lieferantenrabatt_prozent / 100 * k3.listeneinkaufspreis;
        console.log("Lieferantenrabatt korrekt:", Math.abs(k3_rabatt_berechnet - k3.lieferantenrabatt) < 0.01);
    };

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

            // Berechnung im Hundert für Kundenskonto
            const kundenskonto = barverkaufspreis * (vorgabe.kundenskonto_prozent / (100 - vorgabe.kundenskonto_prozent));
            const zielverkaufspreis = barverkaufspreis + kundenskonto;

            // Berechnung im Hundert für Kundenrabatt
            const kundenrabatt = zielverkaufspreis * (vorgabe.kundenrabatt_prozent / (100 - vorgabe.kundenrabatt_prozent));
            const listenverkaufspreis = zielverkaufspreis + kundenrabatt;
            
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
        
        // Kalkulation 2 - Rückwärtsrechnung von Selbstkosten
        if (kalk === 'kalk2') {
            const bareinkaufspreis = vorgabe.selbstkosten - vorgabe.handlungskosten;
            const rechnungspreis = bareinkaufspreis / (1 - vorgabe.lieferantenskonto_prozent / 100);
            const lieferantenskonto = rechnungspreis * (vorgabe.lieferantenskonto_prozent / 100);
            const listeneinkaufspreis = rechnungspreis / (1 - vorgabe.lieferantenrabatt_prozent / 100);
            const lieferantenrabatt = listeneinkaufspreis * (vorgabe.lieferantenrabatt_prozent / 100);
            const gewinn = vorgabe.selbstkosten * (vorgabe.gewinn_prozent / 100);
            const barverkaufspreis = vorgabe.selbstkosten + gewinn;

            // Berechnung im Hundert für Kundenskonto
            const kundenskonto = barverkaufspreis * (vorgabe.kundenskonto_prozent / (100 - vorgabe.kundenskonto_prozent));
            const zielverkaufspreis = barverkaufspreis + kundenskonto;
            const kundenrabatt = vorgabe.listenverkaufspreis - zielverkaufspreis;

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

        // Kalkulation 3 - Gemischte Vorgaben mit Selbstkosten als Ankerpunkt
        if (kalk === 'kalk3') {
            const listeneinkaufspreis = vorgabe.lieferantenrabatt / (vorgabe.lieferantenrabatt_prozent / 100);
            const rechnungspreis = listeneinkaufspreis - vorgabe.lieferantenrabatt;
            const lieferantenskonto = rechnungspreis * (vorgabe.lieferantenskonto_prozent / 100);
            const bareinkaufspreis = rechnungspreis - lieferantenskonto;

            // Selbstkosten berechnen aus Barverkaufspreis und Gewinn
            const selbstkosten = vorgabe.barverkaufspreis - vorgabe.gewinn;
            
            // Handlungskosten als Differenz
            const handlungskosten = selbstkosten - bareinkaufspreis;
            
            const gewinn_prozent = (vorgabe.gewinn / selbstkosten) * 100;
            
            const kundenrabatt = vorgabe.listenverkaufspreis - vorgabe.zielverkaufspreis;
            const kundenrabatt_prozent = (kundenrabatt / vorgabe.listenverkaufspreis) * 100;
            const kundenskonto_prozent = (vorgabe.kundenskonto / vorgabe.zielverkaufspreis) * 100;

            return {
                listeneinkaufspreis,
                rechnungspreis,
                lieferantenskonto,
                bareinkaufspreis,
                selbstkosten,
                handlungskosten,
                gewinn_prozent,
                kundenskonto_prozent,
                kundenrabatt,
                kundenrabatt_prozent
            };
        }

        return {};
    };
    
    // Validiert die Benutzereingaben mit einer Toleranz
    const pruefeEingabe = (wert, korrekt, istProzent = false) => {
        if (!wert || typeof korrekt === 'undefined') return '';
        const eingabe = parseFloat(wert);
        
        if (istProzent) {
            const toleranz = Math.max(0.1, Math.abs(korrekt * 0.01));
            return Math.abs(eingabe - korrekt) <= toleranz ? 'bg-green-100' : 'bg-red-100';
        }
        
        const diff = Math.abs(eingabe - korrekt);
        return diff <= 0.01 ? 'bg-green-100' : 'bg-red-100';
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

    // Generierung von Zufallszahlen für die Kalkulationen
    const generiereZufallsKalkulation = () => {
        const zufallsZahl = (min, max, dezimalstellen = 2) => {
            const zahl = Math.random() * (max - min) + min;
            return parseFloat(zahl.toFixed(dezimalstellen));
        };
        
        // Kalkulation 1: Vorwärtsrechnung
        const k1_listeneinkauf = zufallsZahl(1500, 2500);
        const k1_lieferantenrabatt_prozent = zufallsZahl(5, 12);
        const k1_lieferantenskonto_prozent = zufallsZahl(2, 4);
        const k1_gewinn_prozent = zufallsZahl(8, 15);
        const k1_kundenskonto_prozent = zufallsZahl(2, 3);
        const k1_kundenrabatt_prozent = zufallsZahl(3, 7);
        
        const k1_lieferantenrabatt = Math.round((k1_listeneinkauf * k1_lieferantenrabatt_prozent / 100) * 100) / 100;
        const k1_rechnungspreis = k1_listeneinkauf - k1_lieferantenrabatt;
        const k1_lieferantenskonto = Math.round((k1_rechnungspreis * k1_lieferantenskonto_prozent / 100) * 100) / 100;
        const k1_bareinkaufspreis = k1_rechnungspreis - k1_lieferantenskonto;
        const k1_selbstkosten = Math.round(k1_bareinkaufspreis * 1.4 * 100) / 100;

        // Kalkulation 2: Rückwärtsrechnung
        const k2_selbstkosten = zufallsZahl(5000, 7000);
        const k2_handlungskosten = Math.round(k2_selbstkosten * 0.15 * 100) / 100;
        const k2_lieferantenrabatt_prozent = zufallsZahl(5, 12);
        const k2_lieferantenskonto_prozent = zufallsZahl(2, 4);
        const k2_gewinn_prozent = zufallsZahl(8, 15);
        const k2_kundenskonto_prozent = zufallsZahl(2, 3);
        const k2_kundenrabatt_prozent = zufallsZahl(3, 7);
        
        const k2_gewinn = Math.round(k2_selbstkosten * (k2_gewinn_prozent / 100) * 100) / 100;
        const k2_barverkaufspreis = k2_selbstkosten + k2_gewinn;
        const k2_zielverkaufspreis = Math.round(k2_barverkaufspreis * (1 + k2_kundenskonto_prozent / (100 - k2_kundenskonto_prozent)) * 100) / 100;
        const k2_listenverkaufspreis = Math.round(k2_zielverkaufspreis * (1 + k2_kundenrabatt_prozent / (100 - k2_kundenrabatt_prozent)) * 100) / 100;

        // Wir beginnen mit den Selbstkosten als Ankerpunkt, um Konsistenz zu gewährleisten
        const k3_selbstkosten = zufallsZahl(1200, 1800);
        
        // Berechnung des Bareinkaufspreises (etwa 92% der Selbstkosten)
        const k3_bareinkaufspreis = Math.round(k3_selbstkosten * 0.92 * 100) / 100;
        
        // Handlungskosten korrekt als Differenz zwischen Selbstkosten und Bareinkaufspreis
        const k3_handlungskosten = k3_selbstkosten - k3_bareinkaufspreis;
        
        // Berechnung der Lieferantenwerte
        const k3_lieferantenskonto_prozent = zufallsZahl(2, 3);
        const k3_lieferantenrabatt_prozent = zufallsZahl(15, 25);

        // Neue zufällige Prozentsätze für Gewinn, Kundenskonto und Kundenrabatt
        const k3_gewinn_prozent = zufallsZahl(12, 18);  // Gewinn zwischen 12% und 18%
        const k3_kundenskonto_prozent = zufallsZahl(4, 6);  // Kundenskonto zwischen 4% und 6%
        const k3_kundenrabatt_prozent = zufallsZahl(7, 9);  // Kundenrabatt zwischen 7% und 9%
        
        // Vom Bareinkaufspreis zum Rechnungspreis (unter Berücksichtigung des Lieferantenskontos)
        const k3_rechnungspreis = Math.round(k3_bareinkaufspreis / (1 - k3_lieferantenskonto_prozent / 100) * 100) / 100;
        const k3_lieferantenskonto = Math.round((k3_rechnungspreis - k3_bareinkaufspreis) * 100) / 100;
        
        // Vom Rechnungspreis zum Listeneinkaufspreis
        const k3_listeneinkaufspreis = Math.round(k3_rechnungspreis / (1 - k3_lieferantenrabatt_prozent / 100) * 100) / 100;
        const k3_lieferantenrabatt = Math.round((k3_listeneinkaufspreis - k3_rechnungspreis) * 100) / 100;
        
        // Berechnung mit den neuen Prozentsätzen
        const k3_gewinn = Math.round(k3_selbstkosten * (k3_gewinn_prozent / 100) * 100) / 100;
        const k3_barverkaufspreis = k3_selbstkosten + k3_gewinn;
        
        // Kundenskonto im Hundert berechnen
        const k3_kundenskonto = Math.round(k3_barverkaufspreis * (k3_kundenskonto_prozent / (100 - k3_kundenskonto_prozent)) * 100) / 100;
        const k3_zielverkaufspreis = k3_barverkaufspreis + k3_kundenskonto;
        
        // Kundenrabatt im Hundert berechnen
        const k3_kundenrabatt = Math.round(k3_zielverkaufspreis * (k3_kundenrabatt_prozent / (100 - k3_kundenrabatt_prozent)) * 100) / 100;
        const k3_listenverkaufspreis = k3_zielverkaufspreis + k3_kundenrabatt;

        return {
            kalk1: {
                listeneinkaufspreis: k1_listeneinkauf,
                lieferantenrabatt_prozent: k1_lieferantenrabatt_prozent,
                lieferantenskonto_prozent: k1_lieferantenskonto_prozent,
                selbstkosten: k1_selbstkosten,
                gewinn_prozent: k1_gewinn_prozent,
                kundenskonto_prozent: k1_kundenskonto_prozent,
                kundenrabatt_prozent: k1_kundenrabatt_prozent
            },
            kalk2: {
                selbstkosten: k2_selbstkosten,
                handlungskosten: k2_handlungskosten,
                lieferantenrabatt_prozent: k2_lieferantenrabatt_prozent,
                lieferantenskonto_prozent: k2_lieferantenskonto_prozent,
                gewinn_prozent: k2_gewinn_prozent,
                kundenskonto_prozent: k2_kundenskonto_prozent,
                kundenrabatt_prozent: k2_kundenrabatt_prozent,
                listenverkaufspreis: k2_listenverkaufspreis
            },
            kalk3: {
                lieferantenrabatt_prozent: k3_lieferantenrabatt_prozent,
                lieferantenrabatt: k3_lieferantenrabatt,
                lieferantenskonto_prozent: k3_lieferantenskonto_prozent,
                gewinn: k3_gewinn,
                barverkaufspreis: k3_barverkaufspreis,
                zielverkaufspreis: k3_zielverkaufspreis,
                kundenskonto: k3_kundenskonto,
                listenverkaufspreis: k3_listenverkaufspreis,
            }
        };
    };
    
    // Handler für den "Neue Zahlen"-Button
    const handleNeueZahlen = () => {
        const neueZahlen = generiereZufallsKalkulation();
        setVorgaben(neueZahlen);
        setUserInputs({
            kalk1: {},
            kalk2: {},
            kalk3: {}
        });
    };

    const renderZeile = (label, prozentFeld, betragFeld) => {
        const istVorgabe = (kalk, feld) => {
            return vorgaben[kalk] && vorgaben[kalk][feld] !== undefined;
        };
    
        return (
            <tr>
                <td className="border p-2 font-medium">{label}</td>
                {['kalk1', 'kalk2', 'kalk3'].map((kalk) => (
                    <React.Fragment key={`${kalk}-${betragFeld}`}>
                        <td className="border p-2 w-32">
                            {prozentFeld && (
                                istVorgabe(kalk, prozentFeld) ? (
                                    <div className="bg-yellow-100 p-1 rounded">
                                        {vorgaben[kalk][prozentFeld].toFixed(2)}%
                                    </div>
                                ) : (
                                    <input
                                        type="number"
                                        step="0.01"
                                        className={`w-full p-1 rounded border ${
                                            userInputs[kalk][prozentFeld] ? 
                                                pruefeEingabe(userInputs[kalk][prozentFeld], 
                                                    berechneKorrekt(kalk, vorgaben[kalk])[prozentFeld],
                                                    true) : 
                                                ''
                                        }`}
                                        value={userInputs[kalk][prozentFeld] || ''}
                                        onChange={(e) => handleChange(kalk, prozentFeld, e.target.value)}
                                        placeholder="%"
                                    />
                                )
                            )}
                        </td>
                        <td className="border p-2 w-32">
                            {istVorgabe(kalk, betragFeld) ? (
                                <div className="bg-yellow-100 p-1 rounded">
                                    {vorgaben[kalk][betragFeld].toFixed(2)} €
                                </div>
                            ) : (
                                <input
                                    type="number"
                                    step="0.01"
                                    className={`w-full p-1 rounded border ${
                                        userInputs[kalk][betragFeld] ? 
                                            pruefeEingabe(userInputs[kalk][betragFeld], 
                                                berechneKorrekt(kalk, vorgaben[kalk])[betragFeld],
                                                false) : 
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
    };

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
                        {renderZeile('- Lieferantenrabatt', 'lieferantenrabatt_prozent', 'lieferantenrabatt')}
                        {renderZeile('= Rechnungspreis', null, 'rechnungspreis')}
                        {renderZeile('- Lieferantenskonto', 'lieferantenskonto_prozent', 'lieferantenskonto')}
                        {renderZeile('= Bareinkaufspreis', null, 'bareinkaufspreis')}
                        {renderZeile('+ Handlungskosten', null, 'handlungskosten')}
                        {renderZeile('= Selbstkosten', null, 'selbstkosten')}
                        {renderZeile('+ Gewinn', 'gewinn_prozent', 'gewinn')}
                        {renderZeile('= Barverkaufspreis', null, 'barverkaufspreis')}
                        {renderZeile('+ Kundenskonto', 'kundenskonto_prozent', 'kundenskonto')}
                        {renderZeile('= Zielverkaufspreis', null, 'zielverkaufspreis')}
                        {renderZeile('+ Kundenrabatt', 'kundenrabatt_prozent', 'kundenrabatt')}
                        {renderZeile('= Listenverkaufspreis', null, 'listenverkaufspreis')}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Die Komponente im DOM rendern
ReactDOM.render(<KalkulationUebung />, document.getElementById('root'));
