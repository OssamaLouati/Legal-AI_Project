import { useEffect, useMemo, useState } from 'react';
import AccessDenied from '../components/access-denied';
import { useSession } from 'next-auth/react';
import styles from './dashboard.module.css';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://127.0.0.1:5001';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{ rank: number; score: number; chunk: string }>;
};

const FileUpload: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeSourceRank, setActiveSourceRank] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([
    'What is the termination clause?'
    ,
    'When does the contract expire?'
    ,
    'Who is responsible for payment?'
    ,
    'Are there penalties for early termination?'
    ,
    'What are the confidentiality obligations?'
  ]);

  const [questionDraft, setQuestionDraft] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [backendOk, setBackendOk] = useState<boolean | null>(null);

  const [processingStep, setProcessingStep] = useState<
    'idle' | 'parsing' | 'extracting' | 'indexing' | 'answering' | 'ready'
  >('idle');

  const { data: session, status } = useSession();
  useEffect(() => {
    // backend health
    fetch(`${BACKEND_URL}/health`)
      .then((r) => setBackendOk(r.ok))
      .catch(() => setBackendOk(false));
  }, []);

  const processingSteps = useMemo(
    () => [
      { key: 'parsing', label: 'Parsing document' },
      { key: 'extracting', label: 'Extracting clauses' },
      { key: 'indexing', label: 'Building semantic index' },
      { key: 'answering', label: 'Generating answer' },
    ] as const,
    []
  );

  const stepIndex = (step: typeof processingStep) => {
    const order: Array<typeof processingStep> = ['idle', 'parsing', 'extracting', 'indexing', 'answering', 'ready'];
    return order.indexOf(step);
  };

  const runAsk = async (question: string) => {
    if (!file) {
      setError('Please upload a contract first (PDF or TXT).');
      return;
    }
    if (!question.trim()) return;

    setError(null);
    setIsLoading(true);
    setActiveSourceRank(null);
    setMessages((m) => {
      const last = m[m.length - 1];
      if (last?.role === 'user' && last.content.trim() === question.trim()) {
        return m;
      }
      return [...m, { role: 'user', content: question }];
    });

    // progress animation
    setProcessingStep('parsing');
    const t1 = setTimeout(() => setProcessingStep('extracting'), 600);
    const t2 = setTimeout(() => setProcessingStep('indexing'), 1400);
    const t3 = setTimeout(() => setProcessingStep('answering'), 2200);

    try {
      const formData = new FormData();
      formData.set('file', file);
      formData.set('question', question);

      const resp = await fetch(`${BACKEND_URL}/v2/contracts/answer`, {
        method: 'POST',
        body: formData,
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || `Request failed with ${resp.status}`);
      }

      const data = await resp.json();
      const answerText = typeof data?.answer === 'string' ? data.answer : JSON.stringify(data, null, 2);
      const sources = Array.isArray(data?.top_k) ? data.top_k : [];

      // fallback UX
      const isNoAnswer = answerText.toLowerCase().includes('no answer found');
      const finalText = isNoAnswer
        ? "I couldn't find an exact answer, but these sections may help."
        : answerText;

      setMessages((m) => [...m, { role: 'assistant', content: finalText, sources }]);
      setProcessingStep('ready');
    } catch (e: any) {
      setError(e?.message ?? 'Something went wrong');
      setProcessingStep('idle');
    } finally {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      setIsLoading(false);
    }
  };
  
  
  

  if(status === "unauthenticated") {
    return (
        <>{status}
        <AccessDenied /></>
    )
  }
  
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brand}>
            <div className={styles.brandTitle}>Legal AI Assistant</div>
            <div className={styles.brandSubtitle}>Upload a contract and ask questions about it.</div>
          </div>
          <div className={styles.badges}>
            <span className={`${styles.pill} ${styles.pillOk}`}>Private: processed locally</span>
            <span className={`${styles.pill} ${backendOk ? styles.pillOk : styles.pillWarn}`}>
              {backendOk === null ? 'Checking backend…' : backendOk ? 'Backend online' : 'Backend offline'}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>Upload a contract. Ask anything.</h1>
          <div className={styles.heroSubtitle}>
            Get grounded answers with citations. Your document is processed locally and never stored permanently.
          </div>
        </div>

        <div className={styles.grid}>
          {/* Left: Document */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <span>Document</span>
              <span className={styles.muted}>PDF or TXT</span>
            </div>

            <div className={styles.drop}>
              <div className={styles.muted}>
                Upload a contract to unlock contract summary, key dates, risks, and clause search.
              </div>
              <input
                className={styles.fileInput}
                type="file"
                accept=".pdf,.txt"
                onChange={(e) => {
                  const f = e.target.files?.[0] ?? null;
                  setFile(f);
                  setMessages([]);
                  setActiveSourceRank(null);
                  if (f) {
                    setProcessingStep('ready');
                    setQuestionDraft('');
                  } else {
                    setProcessingStep('idle');
                  }
                }}
              />
              {file && (
                <div className={styles.muted}>
                  Loaded: <strong>{file.name}</strong> ({Math.round(file.size / 1024)} KB)
                </div>
              )}
            </div>

            <div className={styles.steps}>
              {processingSteps.map((s) => {
                const current = stepIndex(processingStep);
                const idx = stepIndex(s.key as any);
                const isDone = current > idx;
                const isActive = current === idx;
                return (
                  <div key={s.key} className={styles.step}>
                    <span
                      className={`${styles.dot} ${isDone ? styles.dotDone : isActive ? styles.dotActive : ''}`}
                    />
                    <span>{s.label}</span>
                  </div>
                );
              })}
              {processingStep === 'ready' && (
                <div className={styles.step}>
                  <span className={`${styles.dot} ${styles.dotDone}`} />
                  <span>Your contract is ready. Ask me anything.</span>
                </div>
              )}
            </div>

            <div style={{ marginTop: 12 }}>
              <div className={styles.cardTitle}>
                <span>Suggested questions</span>
                <span className={styles.muted}>One click</span>
              </div>
              <div className={styles.suggestions}>
                {suggestedQuestions.map((q) => (
                  <button
                    key={q}
                    type="button"
                    className={styles.chip}
                    onClick={() => {
                      setQuestionDraft(q);
                      runAsk(q);
                    }}
                    disabled={isLoading}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 12 }} className={styles.muted}>
              Supported formats: PDF, TXT • Secure local processing • Not stored permanently
            </div>
          </div>

          {/* Center: Chat */}
          <div className={`${styles.card} ${styles.chat}`}>
            <div className={styles.cardTitle}>
              <span>Contract Q&A</span>
              <span className={styles.muted}>Cited answers</span>
            </div>

            <div className={styles.messages}>
              {messages.length === 0 && (
                <div className={styles.msg}>
                  <div className={styles.msgRole}>Assistant</div>
                  <div className={styles.msgText}>
                    Upload a contract, then ask a question like “What is the termination clause?”
                  </div>
                </div>
              )}
              {messages.map((m, idx) => (
                <div key={idx} className={`${styles.msg} ${m.role === 'user' ? styles.msgUser : ''}`}>
                  <div className={styles.msgRole}>{m.role === 'user' ? 'You' : 'Legal AI'}</div>
                  <div className={styles.msgText}>{m.content}</div>

                  {m.role === 'assistant' && m.sources?.length ? (
                    <div className={styles.sources}>
                      {m.sources.slice(0, 5).map((s) => (
                        <button
                          key={s.rank}
                          type="button"
                          className={`${styles.sourceChip} ${
                            activeSourceRank === s.rank ? styles.sourceChipActive : ''
                          }`}
                          onClick={() => setActiveSourceRank(s.rank)}
                        >
                          Source {s.rank} • {Math.round(s.score * 100)}%
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            {error && (
              <div style={{ marginTop: 10 }} className={styles.msg}>
                <div className={styles.msgRole}>Error</div>
                <div className={styles.msgText}>{error}</div>
              </div>
            )}

            <div className={styles.composer}>
              <input
                className={styles.input}
                placeholder="Ask a question about your contract… (e.g., ‘What is the termination clause?’)"
                value={questionDraft}
                onChange={(e) => setQuestionDraft(e.target.value)}
                disabled={isLoading}
              />
              <button
                className={styles.button}
                disabled={isLoading || !questionDraft.trim()}
                onClick={() => {
                  const q = questionDraft;
                  setQuestionDraft('');
                  runAsk(q);
                }}
              >
                {isLoading ? 'Thinking…' : 'Ask'}
              </button>
            </div>
          </div>

          {/* Right: Insights / Clauses */}
          <InsightsPanel
            fileName={file?.name ?? null}
            activeSourceRank={activeSourceRank}
            sources={messages
              .filter((m) => m.role === 'assistant')
              .flatMap((m) => m.sources ?? [])}
          />
        </div>
      </div>
    </div>
  );
};

function InsightsPanel(props: {
  fileName: string | null;
  activeSourceRank: number | null;
  sources: Array<{ rank: number; score: number; chunk: string }>;
}) {
  const { fileName, activeSourceRank, sources } = props;
  const [tab, setTab] = useState<'insights' | 'clauses'>('insights');

  const active = activeSourceRank
    ? sources.find((s) => s.rank === activeSourceRank)
    : null;

  return (
    <div className={styles.card}>
      <div className={styles.cardTitle}>
        <span>Contract Intelligence</span>
        <span className={styles.muted}>{fileName ? fileName : 'No document yet'}</span>
      </div>

      <div className={styles.panelTabs}>
        <button
          type="button"
          className={`${styles.tab} ${tab === 'insights' ? styles.tabActive : ''}`}
          onClick={() => setTab('insights')}
        >
          Insights
        </button>
        <button
          type="button"
          className={`${styles.tab} ${tab === 'clauses' ? styles.tabActive : ''}`}
          onClick={() => setTab('clauses')}
        >
          Clauses
        </button>
      </div>

      {tab === 'insights' ? (
        <div className={styles.kv}>
          <div className={styles.kvRow}>
            <div className={styles.k}>Summary</div>
            <div>Auto-summary (coming next). For now, ask: “Summarize this contract.”</div>
          </div>
          <div className={styles.kvRow}>
            <div className={styles.k}>Key parties</div>
            <div>Provider / Client extraction (coming next).</div>
          </div>
          <div className={styles.kvRow}>
            <div className={styles.k}>Important dates</div>
            <div>Start / end / renewal (coming next).</div>
          </div>
          <div className={styles.kvRow}>
            <div className={styles.k}>Risk warnings</div>
            <div>Early termination, liability caps, auto-renewal (coming next).</div>
          </div>
        </div>
      ) : (
        <div className={styles.clauseList}>
          {sources.length === 0 ? (
            <div className={styles.muted}>Ask a question to see cited clauses here.</div>
          ) : (
            sources
              .slice(0, 8)
              .map((s) => (
                <div
                  key={s.rank}
                  className={`${styles.clause} ${
                    activeSourceRank === s.rank ? styles.clauseActive : ''
                  }`}
                >
                  <div className={styles.clauseTitle}>
                    Source {s.rank} • {Math.round(s.score * 100)}% match
                  </div>
                  <div className={styles.clauseSnippet}>{s.chunk.slice(0, 280)}…</div>
                </div>
              ))
          )}

          {active && (
            <div className={`${styles.clause} ${styles.clauseActive}`}>
              <div className={styles.clauseTitle}>Highlighted clause (active source)</div>
              <div className={styles.clauseSnippet}>{active.chunk}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FileUpload;
