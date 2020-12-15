import React from 'react';
import Link from 'next/link';

import random from 'helpers/random';

import styles from 'styles/components/login-button.module.scss';

const angryEmojis = [
  'o͡͡͡͡͡͡͡͡͡͡͡͡͡͡╮(;´༎ຶД༎ຶ`)╭o͡͡͡͡͡͡͡͡͡͡͡͡͡͡',
  '╰(°ㅂ°)╯',
  'ಠ▃ಠ',
  '(; ⌣̀_⌣́)',
  '(`･︿´･ )',
  '୧༼ ಠ益ಠ ༽୨',
];

export default class LoginButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      alreadyClicked: false,
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    const { alreadyClicked } = this.state;

    if (alreadyClicked) {
      return;
    }

    event.preventDefault();

    const emojiIndex = random({ min: 0, max: angryEmojis.length - 1 });

    global.alert(angryEmojis[emojiIndex]);

    this.setState({
      alreadyClicked: true,
    });
  }

  render() {
    return (
      <Link href="/wardrobe">
        <a title="Не натискати" onClick={(event) => this.handleClick(event)}>
          <div className={styles.button} />
        </a>
      </Link>
    );
  }
}
