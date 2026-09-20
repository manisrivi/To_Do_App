import { useEffect, useState } from 'react';
import type { ToDoListItem } from './to_do_type';
import { createToDo, deleteToDo, readToDo } from './API';

function App() {
  const [value, setValue] = useState('');
  const [list, setList] = useState<ToDoListItem[] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const getList = async () => {
    try {
      const response = await readToDo();
      setList(response || []);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
      setList([]);
    }
  };

  const createHandler = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!value.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const response = await createToDo(value.trim());
      if (response) {
        setValue('');
        await getList();
      }
    } catch (error) {
      console.error('Failed to create todo:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteToDo(id);
      await getList();
    } catch (error) {
      console.error('Failed to delete todo:', error);
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start py-12 px-4 sm:px-6 relative overflow-hidden font-sans">
      {/* Background ambient glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-indigo-500/15 blur-[120px] rounded-full pointer-events-none" />

      <main className="relative w-full max-w-xl bg-slate-900/75 backdrop-blur-xl border border-slate-800/80 shadow-2xl shadow-indigo-950/30 rounded-3xl p-6 sm:p-8 space-y-6">
        {/* Header section */}
        <header className="flex items-center justify-between border-b border-slate-800/80 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-500/20">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Task Manager
              </h1>
              <p className="text-xs text-slate-400">Organize and track your daily priorities</p>
            </div>
          </div>

          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800/90 text-indigo-300 border border-slate-700/60">
            {list ? `${list.length} ${list.length === 1 ? 'task' : 'tasks'}` : 'Loading...'}
          </span>
        </header>

        {/* Input Form */}
        <form onSubmit={createHandler} className="flex gap-2">
          <input
            type="text"
            placeholder="Add a new task..."
            value={value}
            onChange={changeHandler}
            disabled={isSubmitting}
            className="flex-1 bg-slate-950/60 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm sm:text-base rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/80 transition-all"
          />
          <button
            type="submit"
            disabled={isSubmitting || !value.trim()}
            className="px-5 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-medium text-sm sm:text-base shadow-lg shadow-indigo-600/25 transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
          >
            {isSubmitting ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add</span>
              </>
            )}
          </button>
        </form>

        {/* Todo List Items */}
        <div className="space-y-2.5 pt-1">
          {list === null ? (
            <div className="py-10 text-center text-slate-500 text-sm flex flex-col items-center gap-2">
              <svg className="w-6 h-6 animate-spin text-indigo-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span>Loading tasks...</span>
            </div>
          ) : list.length === 0 ? (
            <div className="py-12 px-4 text-center rounded-2xl border border-dashed border-slate-800/90 bg-slate-950/30 flex flex-col items-center justify-center space-y-2">
              <div className="p-3 rounded-full bg-slate-800/40 text-slate-500">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-slate-400 font-medium text-sm">No tasks yet</p>
              <p className="text-slate-600 text-xs max-w-xs">Type your first task above and click Add or press Enter.</p>
            </div>
          ) : (
            list.map((item) => {
              const isDeleting = deletingId === item._id;
              return (
                <div
                  key={item._id}
                  className="group flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/30 transition-all duration-200"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-3">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 group-hover:scale-125 transition-transform" />
                    <span className="text-slate-200 text-sm sm:text-base font-normal break-words">
                      {item.title}
                    </span>
                  </div>

                  <button
                    onClick={() => deleteItem(item._id)}
                    disabled={isDeleting}
                    aria-label="Delete task"
                    className="shrink-0 p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 active:scale-95 transition-all disabled:opacity-40 cursor-pointer"
                  >
                    {isDeleting ? (
                      <svg className="w-4 h-4 animate-spin text-rose-400" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
