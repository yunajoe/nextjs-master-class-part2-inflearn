"use client";

import { proposalActions } from "@/app/proposal-action";
import { useActionState } from "react";

const initialState = {
  success: false,
  message: "",
};

function ProPosalForm() {
  const [state, dispatch, isPending] = useActionState(
    proposalActions,
    initialState,
  );
  return <form></form>;
}

export default ProPosalForm;
