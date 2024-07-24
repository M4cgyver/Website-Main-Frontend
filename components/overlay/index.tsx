"use client";

import styles from './index.module.css';
import { useState } from 'react';

export default function Overlay({ children, button, backgroundColor }: { children?: React.ReactNode, button?: boolean, backgroundColor?: string }) {
  const [showOverlay, setOverlay] = useState(true);
  const showButton = button ?? true;
  const style = (backgroundColor) ? {backgroundColor: backgroundColor} : {}

  return (
    <div className={`${styles.overlay} ${showOverlay ? '' : styles.hidden}`} style={style}>
      <span className={styles.alert}>Heads up!</span>
      {children}
      <button style={{ display: `${(showButton) ? 'block' : 'none'}` }} className={styles.confirm} onClick={() => { setOverlay(false) }}>I Understand!</button>
    </div>
  );
}
