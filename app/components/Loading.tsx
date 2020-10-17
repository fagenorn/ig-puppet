import React from 'react';
import styles from '../sass/Loading.scss';

export default function Loading(): JSX.Element {
  return (
    <div className={styles['loader-container']}>
      <div className={styles['loading-circle']}>
        <div className={styles.loader}>
          <div className={styles.loader}>
            <div className={styles.loader}>
              <div className={styles.loader} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
