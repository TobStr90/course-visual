import React from "react";

import "./HelpWindow.css";

const HelpWindow = ({ onClose }) => {
    return (
        <div>
            <button className="close-button" onClick={onClose}>
                X
            </button>
            <h2>Information:</h2>
            <ul style={{ listStyleType: "none" }}>
                <li>
                    Diese Anwendung wurde entwickelt um die Zusammenhänge des
                    Kurses "Objektorientierte Programmierung" graphisch
                    darzustellen.
                </li>
                <li>
                    Begriffe sind mit den Kapiteln verbunden, in denen sie
                    auftreten.
                </li>
                <li>
                    Begriffe die mit Kapiteln auf demselben Pfad verbunden sind,
                    können als relevant zueinander angesehen werden.
                </li>
            </ul>
            <h2>Bedienung:</h2>
            <ul style={{ listStyleType: "none" }}>
                <li>
                    Klicken mit der linken Maustaste auf einen Knoten klappt
                    diesen ein bzw. aus (ausklappbare Knoten werden grün
                    hinterlegt angezeigt).
                </li>
                <li>
                    Klicken mit der rechten Maustaste auf einen Knoten öffnet
                    ein Fenster zum Bearbeiten von Knoten.
                </li>
                <li>
                    Knoten können im Graphen durch "Drag and Drop" mit der
                    linken Maustaste bewegt werden.
                </li>
                <li>
                    Klicken mit der linken Maustaste auf den Graph erlaubt es,
                    diesen zu bewegen.
                </li>
                <li>Mittels Mausrad kann gezoomt werden.</li>
                <li>
                    Im Quiz müssen zwei Knoten nacheinander mit der linken
                    Maustaste angelickt werden. Besteht eine Verbindung zwischen
                    diesen beiden Knoten, wird eine Kante hinzugefügt.
                </li>
            </ul>

            <h2>Optionen:</h2>
            <ul style={{ listStyleType: "none" }}>
                <li>
                    <b>Graphmodus:</b> Bestimmt das Layout des Graphen.
                </li>
                <li>
                    <b>Aktive Kurseinheiten:</b> Filtert nicht ausgewählte
                    Kurseinheiten.
                </li>
                <li>
                    <b>Knoten suchen:</b> Zeigt den Knoten bzw. alle Pfade zum
                    gesuchten Knoten an.
                </li>
                <li>
                    <b>Knoten hinzufügen:</b> Öffnet ein Fenster zum Erstellen
                    von neuen Knoten.
                </li>
                <li>
                    <b>Alle Knoten einklappen:</b> Öffnet alle Knoten im Graph
                    (Achtung: unübersichtlich).
                </li>
                <li>
                    <b>Alle Knoten ausklappen:</b> Schließt alle Knoten bis auf
                    die Wurzel.
                </li>
                <li>
                    <b>Lokale Daten zurücksetzen:</b> Setzt den Ursprungszustand
                    des Graphen wieder her.
                </li>
            </ul>
        </div>
    );
};

export default HelpWindow;
