import React, { useState, useEffect } from 'react';
import Workbench from '../components/layout/Workbench';
import CardboardButton from '../components/ui/CardboardButton';
import { QuestionService } from '../services/QuestionService';
import useGameStore from '../store/gameStore';

const AdminScreen = ({ onBack }) => {
    const [questions, setQuestions] = useState([]);
    const [jsonInput, setJsonInput] = useState('');
    const [view, setView] = useState('list'); // 'list' | 'add' | 'bulk'
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({});

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [data, statsData] = await Promise.all([
                QuestionService.getAll(),
                QuestionService.getStats()
            ]);

            setQuestions(data || []);

            // Map stats by question text (or ID if we matched IDs correctly in backend query, but ID is cleaner)
            const statsMap = {};
            if (Array.isArray(statsData)) {
                statsData.forEach(s => {
                    const rate = s.total_attempts > 0 ? (s.correct_count / s.total_attempts) : 0;
                    statsMap[s.question] = {
                        ...s,
                        rate: Math.round(rate * 100),
                        color: rate < 0.5 ? 'text-red-500 font-bold' : (rate < 0.8 ? 'text-orange-500' : 'text-green-500')
                    };
                });
            }
            setStats(statsMap);
        } catch (e) {
            console.error("Failed to load data", e);
        } finally {
            setLoading(false);
        }
    }

    const handleBulkSave = async () => {
        try {
            const parsed = JSON.parse(jsonInput);
            if (!Array.isArray(parsed)) throw new Error('Input must be an array of questions');

            // Basic validation
            if (!parsed[0].question || !parsed[0].answers) throw new Error('Invalid format (check example)');

            setLoading(true);
            await QuestionService.saveAll(parsed);
            await loadData(); // Reload list from server
            alert('Vragen opgeslagen in Database!');
            setView('list');
        } catch (e) {
            alert('Error: ' + e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Weet je zeker dat je deze vraag wilt verwijderen?')) {
            setLoading(true);
            try {
                await QuestionService.deleteQuestion(id);
                await loadData();
            } catch (e) {
                alert('Fout bij verwijderen: ' + e.message);
            } finally {
                setLoading(false);
            }
        }
    };

    const [editingQuestion, setEditingQuestion] = useState(null);

    const handleEditClick = (q) => {
        // deep copy to avoid reference issues
        setEditingQuestion(JSON.parse(JSON.stringify(q)));
    };

    const handleUpdateSave = async () => {
        if (!editingQuestion) return;
        setLoading(true);
        try {
            // Parse tags if string
            let tags = editingQuestion.tags;
            if (typeof tags === 'string') {
                tags = tags.split(',').map(t => t.trim()).filter(Boolean);
            }

            // Parse answers if string (simple validation)
            let answers = editingQuestion.answers;
            if (typeof answers === 'string') {
                try {
                    answers = JSON.parse(answers);
                } catch (e) {
                    throw new Error('Answers JSON is ongeldig');
                }
            }

            await QuestionService.updateQuestion(editingQuestion.id, {
                ...editingQuestion,
                tags,
                answers
            });

            await loadData();
            setEditingQuestion(null);
        } catch (e) {
            alert('Fout bij updaten: ' + e.message);
        } finally {
            setLoading(false);
        }
    };

    // New Handlers for Phase 9
    const handleDeleteAll = async () => {
        if (confirm("WEET JE HET ZEKER? 😱\n\nDit verwijdert ALLE vragen en statistieken uit de database. Dit kan niet ongedaan worden gemaakt!")) {
            if (confirm("Echt heel zeker? 100%?")) {
                setLoading(true);
                try {
                    await QuestionService.deleteAll();
                    await loadData();
                    alert("Poef! Alles is weg.");
                } catch (e) {
                    alert("Fout: " + e.message);
                } finally {
                    setLoading(false);
                }
            }
        }
    };

    const { resetProgress } = useGameStore.getState(); // Get action via getState to avoid hook rule issues if calling outside, but inside component is fine to use hook.
    // Actually better to use hook at top level

    const handleFactoryReset = async () => {
        if (confirm("⚠️ FABRIEKSINSTELLINGEN TERUGZETTEN?\n\nJe verliest al je muntjes, items en level voortgang.")) {
            try {
                // 1. Reset Backend Stats
                await QuestionService.resetStats();
                // 2. Reset Frontend Store
                useGameStore.getState().resetProgress(); // Direct access
                alert("De app is gereset! Veel plezier met opnieuw beginnen.");
                window.location.reload(); // Hard reload to clear any lingering layout state
            } catch (e) {
                alert("Reset mislukt: " + e.message);
            }
        }
    };

    return (
        <Workbench>
            {editingQuestion && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white p-6 rounded-lg w-full max-w-2xl shadow-xl border-4 text-left border-gray-800 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold">Vraag Bewerken</h2>

                        <div>
                            <label className="block text-sm font-bold mb-1">Vraag:</label>
                            <input
                                className="w-full border p-2 rounded"
                                value={editingQuestion.question}
                                onChange={e => setEditingQuestion({ ...editingQuestion, question: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-1">Tags (komma gescheiden):</label>
                            <input
                                className="w-full border p-2 rounded"
                                value={Array.isArray(editingQuestion.tags) ? editingQuestion.tags.join(', ') : editingQuestion.tags}
                                onChange={e => setEditingQuestion({ ...editingQuestion, tags: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-1">Antwoorden (JSON):</label>
                            <textarea
                                className="w-full border p-2 rounded h-32 font-mono text-sm"
                                value={typeof editingQuestion.answers === 'string' ? editingQuestion.answers : JSON.stringify(editingQuestion.answers, null, 2)}
                                onChange={e => setEditingQuestion({ ...editingQuestion, answers: e.target.value })}
                            />
                        </div>

                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={() => setEditingQuestion(null)}
                                className="px-4 py-2 border rounded hover:bg-gray-100"
                            >
                                Annuleren
                            </button>
                            <button
                                onClick={handleUpdateSave}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Opslaan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="absolute top-4 left-4 z-50">
                <CardboardButton onClick={onBack} className="!px-4 !py-2 !text-lg">
                    ← TERUG
                </CardboardButton>
            </div>

            <div className="w-full h-full flex flex-col p-4 bg-white/90 overflow-y-auto custom-scrollbar rounded-lg border-2 border-gray-400">

                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold font-hand">
                        ADMINISTRATIE {loading && <span className="text-base font-normal text-gray-500 animate-pulse">(Laden...)</span>}
                    </h1>
                    <div className="flex gap-2">
                        <button onClick={() => setView('list')} className="bg-blue-500 text-white px-4 py-2 rounded">Lijst</button>
                        <button onClick={() => setView('bulk')} className="bg-gray-700 text-white px-4 py-2 rounded">Bulk Import</button>
                        <button onClick={() => setView('settings')} className="bg-red-500 text-white px-4 py-2 rounded">Reset</button>
                    </div>
                </div>

                {view === 'list' && (
                    <div className="flex flex-col gap-4">
                        <p className="italic text-gray-600">Huidige Vragen: {questions.length}</p>
                        {questions.length === 0 && !loading && (
                            <div className="p-8 text-center text-gray-400 border-2 border-dashed">
                                Nog geen vragen gevonden in de database.
                            </div>
                        )}
                        {questions.map((q, idx) => (
                            <div key={q.id || idx} className="border p-4 rounded bg-gray-50 flex justify-between items-start group">
                                <div className="flex-1">
                                    <div className="font-bold">{q.question}</div>
                                    <div className="text-sm text-gray-500">Tags: {q.tags ? q.tags.join(', ') : '-'}</div>
                                    <div className="text-xs text-gray-400 mt-1">ID: {q.id}</div>

                                    {/* Stats Indicator */}
                                    {stats[q.question] && (
                                        <div className={`text-xs mt-1 ${stats[q.question].color}`}>
                                            Score: {stats[q.question].rate}% ({stats[q.question].correct_count}/{stats[q.question].total_attempts})
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEditClick(q)}
                                        className="bg-yellow-400 text-white p-2 rounded hover:bg-yellow-500 transition-colors"
                                        title="Bewerken"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        onClick={() => handleDelete(q.id)}
                                        className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors"
                                        title="Verwijderen"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {view === 'bulk' && (
                    <div className="flex flex-col gap-4 h-full pb-8">
                        <p>Plak hier je JSON. Zorg dat het formaat klopt.</p>
                        <div className="text-xs bg-gray-100 p-2 mb-2 font-mono">
                            Voorbeeld:<br />
                            [{`{"question": "Vraag?", "tags": ["level1"], "answers": [{"label":"A", "isCorrect":true}]}`}]
                        </div>
                        <textarea
                            className="w-full h-64 p-4 font-mono text-sm border-2 border-gray-300 rounded resize-none focus:border-blue-500 outline-none"
                            value={jsonInput}
                            onChange={(e) => setJsonInput(e.target.value)}
                            placeholder='[{"question": "...", "answers": [...], "tags": ["space"]}]'
                            disabled={loading}
                        />
                        <div className="flex justify-end gap-2">
                            <CardboardButton
                                onClick={handleDeleteAll}
                                className={`bg-red-100 !border-red-600 text-red-800 ${loading ? 'opacity-50 pointer-events-none' : ''}`}
                            >
                                🗑️ ALLES WISSEN
                            </CardboardButton>
                            <CardboardButton
                                onClick={handleBulkSave}
                                className={`bg-green-100 !border-green-600 ${loading ? 'opacity-50 pointer-events-none' : ''}`}
                            >
                                {loading ? 'BEZIG...' : 'OPSLAAN'}
                            </CardboardButton>
                        </div>
                    </div>
                )}

                {view === 'settings' && (
                    <div className="flex flex-col items-center justify-center h-full gap-8 p-8">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold mb-2">GEVAAR ZONE ⚠️</h2>
                            <p className="text-gray-600 max-w-md">Hier kun je de app volledig resetten. Dit wist alle voortgang, muntjes en statistieken.</p>
                        </div>

                        <CardboardButton
                            onClick={handleFactoryReset}
                            className="bg-red-500 !text-white !border-red-800 text-xl"
                        >
                            💥 FACTORY RESET (ALLES WISSEN)
                        </CardboardButton>
                    </div>
                )}

            </div>
        </Workbench>
    );
};

export default AdminScreen;
