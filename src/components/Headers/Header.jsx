import React from 'react'
import Button from '../Buttons/Button'

const Header = () => {
    const tg = window.Telegram.WebApp;
  
    const onClose = () => {
      tg.close()
    }

    return (
        <div className={'header'}>
            <Button>Закрыть</Button>
            <span сlass={'username'}>
                {tg.initDataUnsafe?.user?.username}
            </span>
        </div>
    )
}

export default Header