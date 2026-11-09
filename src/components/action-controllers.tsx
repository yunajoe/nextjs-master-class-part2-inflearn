"use client";
import {
  deleteInstantEvaluation,
  deleteSoftEvaluation,
} from "@/app/mission-actions2";

function ActionControllers({ evalId }: { evalId: string }) {
  return (
    <div>
      <button
        className="px-4 py-2 bg-slate-200 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-300 transition-colors"
        onClick={() => deleteSoftEvaluation(evalId)}
      >
        SOFT 삭제
      </button>
      <button
        className="px-4 py-2 bg-red-100 text-red-600 font-bold text-sm rounded-xl hover:bg-red-500 hover:text-white transition-colors border border-red-200"
        onClick={() => deleteInstantEvaluation(evalId)}
      >
        INSTANT 삭제
      </button>
    </div>
  );
}

export default ActionControllers;
