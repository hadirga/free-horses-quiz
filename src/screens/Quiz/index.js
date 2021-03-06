import React from 'react';
import { useRouter } from 'next/router';

import styled from 'styled-components';
import QuizBackground from '../../components/QuizBackground/QuizBackground';
import QuizContainer from '../../components/QuizContainer/QuizContainer';
import QuizLogo from '../../components/QuizLogo/QuizLogo';
import GitHubCorner from '../../components/GitHubCorner/GitHubCorner';
import Widget from '../../components/Widget/Widget';
import Footer from '../../components/Footer/Footer';
import AlternativesForm from '../../components/AlternativesForm';

// import db from '../../../db.json';
import Button from '../../components/Button/Button';
import BackLinkArrow from '../../components/BackLinkArrow';
import Toast from '../../components/Toast';

function ResultWidget({ results }) {
  return (
    <Widget>
      <Widget.Header>
        Resultados do quiz
      </Widget.Header>
      <Widget.Content>
        <p>
          Você acertou
          {' '}
          {/* {results.reduce((sumAtual, resultAtual) => {
            const isAcerto = resultAtual === true;
            if (isAcerto) {
              return sumAtual + 1;
            }
            return sumAtual;
          }, 0)} */}
          {results.filter((x) => x).length}
          {' '}
          questões, parabéns!
        </p>
        <ul>
          {results.map((result, resultIndex) => (
            <li key={`result__${resultIndex}`}>
              #
              {resultIndex + 1}
              {' '}
              Resultado:
              {result === true ? 'Acertou!' : 'Errou!'}
            </li>
          ))}
        </ul>
      </Widget.Content>
    </Widget>
  );
}

function LoadingWidget() {
  return (
    <Widget>
      <Widget.Header>
        Carregando...
      </Widget.Header>
      <Widget.Content>
        [Desafio do Loading]
      </Widget.Content>
    </Widget>
  );
}

function QuestionWidget({
  question,
  questionIndex,
  totalQuestions,
  onSubmit,
  showToast,
  addResult,
}) {
  const [selectedAlternative, setSelectedAlternative] = React.useState(undefined);
  const [isQuestionSubmited, setIsQuestionSubmited] = React.useState(false);
  const questionId = `question__${questionIndex}`;
  const isCorrect = selectedAlternative === question.answer;
  const hasAlternativeSelected = selectedAlternative !== undefined;

  return (
    <Widget>
      <Widget.Header>
        <BackLinkArrow href="/" />
        <h3>
          {`Pergunta ${questionIndex + 1} de ${totalQuestions}`}
        </h3>
      </Widget.Header>

      <img
        alt="Descrução"
        style={{
          width: '100%',
          height: '150px',
          objectFit: 'cover',
        }}
        src={question.image}
      />

      <Widget.Content>
        <h2>{question.title}</h2>
        <p>{question.description}</p>

        <AlternativesForm
          onSubmit={(infosDoEvento) => {
            infosDoEvento.preventDefault();
            setIsQuestionSubmited(true);
            setTimeout(() => {
              addResult(isCorrect);
              onSubmit();
              setIsQuestionSubmited(false);
              setSelectedAlternative(undefined);
            }, 3 * 1000);
            //isQuestionSubmited && isCorrect && showToast('success', 'Você acertou!');
            //isQuestionSubmited && !isCorrect && showToast('danger', 'Você errou, a próxima será melhor!');

            isCorrect
              ? showToast('success', 'Você acertou!')
              : showToast('danger', 'Você errou, a próxima será melhor!');
          }}
        >
          {question.alternatives.map((alternative, alternativeIndex) => {
            const alternativeId = `alternative__${alternativeIndex}`;
            const alternativeStatus = isCorrect ? 'SUCCESS' : 'ERROR';
            const isSelected = selectedAlternative === alternativeIndex;
            return (
              <Widget.Topic
                as="label"
                htmlFor={alternativeId}
                key={alternativeId}
                data-selected={isSelected}
                data-status={isQuestionSubmited && alternativeStatus}
              >
                <input
                  style={{ display: 'none' }}
                  id={alternativeId}
                  name={questionId}
                  onChange={() => setSelectedAlternative(alternativeIndex)}
                  type="radio"
                />
                {alternative}
              </Widget.Topic>
            );
          })}

          {/* <pre>
            {JSON.stringify(question, null, 4)}
          </pre> */}

          <Button type="submit" disabled={!hasAlternativeSelected}>
            Confirmar
          </Button>
          {/* {isQuestionSubmited && isCorrect && <p>Você acertou!</p>}
          {isQuestionSubmited && !isCorrect && <p>Você errou!</p>} */}
        </AlternativesForm>
      </Widget.Content>
    </Widget>
  );
}

const screenStates = {
  QUIZ: 'QUIZ',
  LOADING: 'LOADING',
  RESULT: 'RESULT',
};

function QuizPage({ questions, theBg }) {
  // const router = useRouter();
  // const nomeJogador = router.query.name;
  const [screenState, setScreenState] = React.useState(screenStates.LOADING);
  const [results, setResults] = React.useState([]);
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const questionIndex = currentQuestion;
  const question = questions[questionIndex];
  const totalQuestions = questions.length;
  const bg = theBg;

  // toast values
  const [list, setList] = React.useState([]);
  const timeoutValue = 2500;
  let toastProperties = null;

  function addResult(result) {
    setResults([
      ...results,
      result,
    ]);
  }

  React.useEffect(() => {
    // fetch()...
    setTimeout(() => {
      setScreenState(screenStates.QUIZ);
    }, 1 * 1000);
  }, []);

  function handleSubmitQuiz() {
    const nextQuestion = questionIndex + 1;
    if (nextQuestion < totalQuestions) {
      setCurrentQuestion(nextQuestion);
    } else {
      setScreenState(screenStates.RESULT);
    }
  }

  function showToast(type, descriptionReceived) {
    const id = Math.floor((Math.random() * 101) + 1);

    switch (type) {
      case 'success':
        toastProperties = {
          id,
          title: 'Parabéns!',
          description: descriptionReceived,
          backgroundColor: '#5cb85c',
          // icon: checkIcon,
        };
        break;
      case 'danger':
        toastProperties = {
          id,
          title: 'Errado!',
          description: descriptionReceived,
          backgroundColor: '#d9534f',
          // icon: errorIcon,
        };
        break;
      default:
        setList([]);
    }
    setList([...list, toastProperties]);
  }

  return (
    <QuizBackground backgroundImage={bg}>
      <QuizContainer>
        <QuizLogo />
        {screenState === screenStates.QUIZ && (
          <QuestionWidget
            question={question}
            totalQuestions={totalQuestions}
            questionIndex={questionIndex}
            onSubmit={handleSubmitQuiz}
            showToast={showToast}
            addResult={addResult}
          />
        )}
        {screenState === screenStates.LOADING && <LoadingWidget />}
        {screenState === screenStates.RESULT && <ResultWidget results={results} />}
        <Toast
          toastList={list}
          timeoutValue={timeoutValue}
        />

        <Footer />
      </QuizContainer>
      <GitHubCorner projectUrl="https://github.com/hadirga/free-horses-quiz" />
    </QuizBackground>
  );
}

export default QuizPage;
