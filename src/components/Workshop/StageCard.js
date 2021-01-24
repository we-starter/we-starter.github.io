import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";

export const StageCard = ({
                            time,
                              number,
                              stageText,
                              title,
                              timeIn,
                              status,
                              description,
                              active,
                              link
                          }) => {

    const [leftTime, setLeftTime] = useState()

  useEffect(()=>{
    if(time){
      console.log('rendertime',time)
      let leftd = Math.floor(time / (1000 * 60 * 60 * 24));
      let lefth = Math.floor(time / (1000 * 60 * 60) % 24);
      let leftm = Math.floor(time / (1000 * 60) % 60);
      let lefts = Math.floor(time / 1000 % 60);
      const left = {
        days: leftd < 0 ? 0 : leftd,
        hours: lefth < 0 ? 0 : lefth,
        minutes: leftm < 0 ? 0 : leftm,
        seconds: lefts < 0 ? 0 : lefts,
      };
      console.log('left itme',left)
      setLeftTime(left)
    }
  },[time])

    return (
        <div className="workshop-cards__item">
            <div className="workshop-cards__number">{number}</div>
            <h2 className="workshop-cards__title">{stageText}</h2>
            <p className="workshop-cards__name">
                <span>{title}</span>
            </p>
            <hr/>
            <dl className="workshop-cards__dl">
                <div className="workshop-cards__dl-row">
                    <dt className="workshop-cards__dl-dt">Time in</dt>
                    <dd className="workshop-cards__dl-dd">{timeIn}</dd>
                </div>
                <div className="workshop-cards__dl-row">
                    <dt className="workshop-cards__dl-dt">Status</dt>
                    <dd className="workshop-cards__dl-dd workshop-cards__dl-dd--green">
                        {status}
                    </dd>
                </div>
            </dl>
            <hr/>
            <p className="workshop-cards__text">{description}</p>
            <Link to={link} style={{backgroundColor: active ? '' : 'rgba(0, 0, 0, 0.5)'}} className="workshop-cards__btn btn">
              {leftTime? `${leftTime.days}d ${leftTime.hours}h ${leftTime.minutes}m ${leftTime.seconds}s` : 'Join'}
            </Link>
        </div>
    );
};
