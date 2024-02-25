import React from 'react'
import { Menu, MenuItem, IconButton } from '@mui/material'
import ShareIcon from '@mui/icons-material/Share'
import {
  FacebookShareButton,
  WhatsappShareButton,
  LinkedinShareButton
} from 'react-share'
import { FacebookIcon, WhatsappIcon, LinkedinIcon } from 'react-share'

function ShareUs () {
  const shareUrl = process.env.REACT_APP_URL
  const title = 'Checkout this amazing react app TodayJalanWhereSG !!'
  const summary =
    'React app - Simplify your commute by offering real-time carpark availability alongside accurate weather forecasts for your parking spots.'
  const source = 'TodayJalanWhereSG'

  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <IconButton color='inherit' onClick={handleClick}>
        <ShareIcon /> {/* Display share icon */}
      </IconButton>
      <Menu
        id='share-menu'
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClick={handleClose}
      >
        <MenuItem onClick={handleClose}>
          <FacebookShareButton url={shareUrl} title={title} separator=':: '>
            <FacebookIcon size={32} round />
          </FacebookShareButton>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <WhatsappShareButton url={shareUrl} title={title} separator=':: '>
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <LinkedinShareButton
            url={shareUrl}
            title={title}
            separator=':: '
            source={source}
            summary={summary}
          >
            <LinkedinIcon size={32} round />
          </LinkedinShareButton>
        </MenuItem>
      </Menu>
    </>
  )
}

export default ShareUs
