import React from 'react';
import CodingProblem from './CodingProblem/index';
import MultipleChoices from './MultipleChoices/index';

export default function Questions({listOfQuestions,handleChangeQuestionMC,handleChangeAnswerMC,handleChangeCorrectAnswer,handleChangeScore,
    handleChangeCPTitle,handleChangeLanguague,handleChangeCPInfo,handleChangeCPDifficulty,handleChangeCPCode,handleChangeCPFiles,
    handleChangeSimpleTest,handleTestCode,handleChangeTime}){
    return (
        <>
            {listOfQuestions.map((value,key)=> (
                <div key={key}>
                    {
                        value.IsMultipleChoices ? 
                        <MultipleChoices NO={key} value={value} handleChangeQuestionMC={handleChangeQuestionMC}
                            handleChangeAnswerMC={handleChangeAnswerMC}
                            handleChangeCorrectAnswer={handleChangeCorrectAnswer}
                            handleChangeScore={handleChangeScore} handleChangeTime={handleChangeTime}/>
                        :
                        <CodingProblem NO={key} value={value} handleChangeScore={handleChangeScore} handleChangeCPTitle={handleChangeCPTitle}
                        handleChangeCPInfo={handleChangeCPInfo} handleChangeLanguague={handleChangeLanguague} 
                        handleChangeCPDifficulty={handleChangeCPDifficulty} handleChangeCPCode={handleChangeCPCode}
                        handleChangeCPFiles={handleChangeCPFiles} handleChangeSimpleTest={handleChangeSimpleTest}
                        handleTestCode={handleTestCode} handleChangeTime={handleChangeTime}/>
                    }
                    <br/>
                </div>
            ))}
        </>
    )
}