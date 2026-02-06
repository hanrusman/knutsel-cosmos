import React, { useState, useEffect } from 'react';
import Workbench from '../components/layout/Workbench';
import CardboardButton from '../components/ui/CardboardButton';
import { QuestionService } from '../services/QuestionService';

const AdminScreen = ({ onBack }) => {
    const [questions, setQuestions] = useState([]);
    const [jsonInput, setJsonInput] = useState('');
    const [view, setView] = useState('list'); // 'list' | 'add' | 'bulk'
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const data = await QuestionService.getAll();
        setQuestions(data || []); // Ensure array
        setLoading(false);
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

    return (
        <Workbench>
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
                            <div key={q.id || idx} className="border p-4 rounded bg-gray-50 flex justify-between items-start">
                                <div>
                                    <div className="font-bold">{q.question}</div>
                                    <div className="text-sm text-gray-500">Tags: {q.tags ? q.tags.join(', ') : '-'}</div>
                                </div>
                                <div className="text-xs bg-gray-200 px-2 py-1 rounded max-w-[100px] truncate">
                                    ID: {q.id}
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
                        <div className="flex justify-end">
                            <CardboardButton
                                onClick={handleBulkSave}
                                className={`bg-green-100 !border-green-600 ${loading ? 'opacity-50 pointer-events-none' : ''}`}
                            >
                                {loading ? 'BEZIG...' : 'OPSLAAN'}
                            </CardboardButton>
                        </div>
                    </div>
                )}

            </div>
        </Workbench>
    );
};

export default AdminScreen;
