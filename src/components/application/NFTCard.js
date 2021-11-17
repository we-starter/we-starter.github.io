import React from "react";
import {getIPFSFile} from "../../utils/ipfs";
import WebsiteIcon from "../../assets/icon/application/website.svg";
import TwitterIcon from "../../assets/icon/application/twitter.svg";
import DiscordIcon from "../../assets/icon/application/discord.svg";
import TelegramIcon from "../../assets/icon/application/tme.svg";
import MediumIcon from "../../assets/icon/application/medium.svg";
import {Spin} from "antd";
import CreateIcon from "../../assets/icon/application/create.svg";
export default function NFTCard({nftData, ipfsData, children, preView}){
  return (
    <div className="nft-card">
      <p className="nft-card-title">ID: {nftData && nftData.tokenId}</p>
      {
        nftData||preView ? (
          <div className="nft-card-info">
            {
              ipfsData ? (
                <React.Fragment>
                  <div className="nft-card-info-t">
                    <img src={getIPFSFile(ipfsData.logo)} alt=""/>
                    <div>
                      <h2>{ipfsData.name}</h2>
                      <p>{ipfsData.tokenTicker}</p>
                    </div>
                  </div>
                  <div className="url-list">
                    {ipfsData.website &&
                    <a href={ipfsData.website} target="_blank"><img src={WebsiteIcon} alt="website"/></a>}
                    {ipfsData.twitter &&
                    <a href={ipfsData.twitter} target="_blank"><img src={TwitterIcon} alt="twitter"/></a>}
                    {ipfsData.discord &&
                    <a href={ipfsData.discord} target="_blank"><img src={DiscordIcon} alt="discord"/></a>}
                    {ipfsData.telegram &&
                    <a href={ipfsData.telegram} target="_blank"><img src={TelegramIcon} alt="telegram"/></a>}
                    {ipfsData.medium && <a href={ipfsData.medium} target="_blank"><img src={MediumIcon} alt="medium"/></a>}
                  </div>
                </React.Fragment>
              ) : <div className="nft-spin"><Spin /></div>
            }
          </div>
        ) : (
          <div className="create-view">
            <img src={CreateIcon} alt="create"/>
            <p>Create new Project NFT Card</p>
          </div>
        )
      }
      {children}
    </div>
  )
}
