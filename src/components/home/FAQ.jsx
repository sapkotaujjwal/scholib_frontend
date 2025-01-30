import React from 'react'
import './faq.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons'

const FAQ = ({array=[]}) => {


  return (
    <div className='faqCONATIebe55'>
        {array.length > 0 && <div className="faq-box">
            <p className="h4 w600 text-center top-p">
                    FAQ
            </p>

            <div className="box">
                <div className="each left">

                    {
                        array.map((obj,index)=>{

                            if(index % 2 === 1) {
                                return null;
                            }

                            return(
                                <div className="content" id={`faqContentC${index}`} onClick={()=> document.getElementById(`faqContentC${index}`).classList.toggle('active') }>
                                <div className="question"> <p className="h6 w600 my-2"> {obj.question} 
                                <span className="icon flex1"> 
                                <FontAwesomeIcon icon={faCaretLeft} className='d-our-transform' /> </span> </p> </div> 
                                <div className="answer d-not-active"> <p className="h6 w400 mb-2"> {obj.answer} </p> </div>
                            </div>
                            )
                        })
                    }


                </div>





                <div className="each right">

                {
                        array.map((obj,index)=>{

                            if(index % 2 === 0 || index === 0) {
                                return null;
                            }

                            return(
                                <div className="content" id={`faqContentC${index}`} onClick={()=> document.getElementById(`faqContentC${index}`).classList.toggle('active') }>
                                <div className="question"> <p className="h6 w600 my-2"> {obj.question} 
                                <span className="icon flex1"> 
                                <FontAwesomeIcon icon={faCaretLeft} className='d-our-transform' /> </span> </p> </div> 
                                <div className="answer d-not-active"> <p className="h6 w400 mb-2"> {obj.answer} </p> </div>
                            </div>
                            )
                        })
                    }
       

                </div>
            </div>
        </div>}
    </div>
  )
}

export default FAQ
