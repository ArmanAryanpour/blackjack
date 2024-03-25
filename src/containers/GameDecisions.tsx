import {
  DecisionsWrapper,
  FormField,
  FormWrapper,
  GameButton,
} from "@/components/Decisions";
import { usePlayerState } from "@/store/player/hook";
import { useTableActions, useTableState } from "@/store/table/hook";
import { Formik } from "formik";
import { AnimatePresence } from "framer-motion";
import * as Yup from "yup";

export default function GameDecisions() {
  const {
    isActiveGame,
    isActiveGameStarted,
    isActiveGameBetting,
    isWaitingForBets,
    isActiveGameFinished,
  } = useTableState();
  const {
    hitPlayer,
    newGame,
    stopBetting,
    startGame,
    newPlayer,
    startBetting,
    standPlayer,
  } = useTableActions();
  const { name } = usePlayerState();

  return (
    <DecisionsWrapper>
      <AnimatePresence exitBeforeEnter>
        {isActiveGame ? (
          isActiveGameFinished ? (
            <GameButton
              key={"start-button"}
              onClick={() => {
                newGame();
                newPlayer(name);
                startBetting();
              }}
            >
              Start Another Game
            </GameButton>
          ) : isActiveGameStarted ? (
            <>
              <GameButton onClick={() => standPlayer()}>Stand</GameButton>
              <GameButton onClick={() => hitPlayer()}>Hit</GameButton>
            </>
          ) : isActiveGameBetting ? (
            <>
              <GameButton
                key={"go-back-button"}
                onClick={() => {
                  stopBetting();
                }}
                xs
              >
                Go Back
              </GameButton>
              <GameButton
                key={"confirm-bet-button"}
                disabled={isWaitingForBets}
                onClick={() => {
                  startGame();
                }}
              >
                Confirm Bets
              </GameButton>
            </>
          ) : (
            <Formik
              initialValues={{
                name,
              }}
              validationSchema={Yup.object({
                name: Yup.string().required("Name is required"),
              })}
              onSubmit={(values, a) => {
                newPlayer(values.name);
                startBetting();
                a.resetForm();
              }}
            >
              <FormWrapper>
                <FormField name="name" title="Name" />
                <GameButton type="submit" xs>
                  Start Game
                </GameButton>
              </FormWrapper>
            </Formik>
          )
        ) : (
          <GameButton
            key={"start-button"}
            onClick={() => {
              newGame();
            }}
          >
            Start Game
          </GameButton>
        )}
      </AnimatePresence>
    </DecisionsWrapper>
  );
}
