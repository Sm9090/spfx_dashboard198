import * as React from 'react';
import { DefaultPalette, Text } from 'office-ui-fabric-react';
import styles from './OrderTimeline.module.scss'; // Import module styles

// Type definition for timeline items
interface ITimelineItem {
  label: string;
  timestamp: string;
  color: string;
}

interface IOrderTimelineProps {
  items: ITimelineItem[]; 
}

const OrderTimeline: React.FC<IOrderTimelineProps> = ({
  items,
}) => {
  return (
    <div className={styles.timelineContainer}>
    
      <div className={styles.timeline}>
        {items.map((item, index) => (
          <div
            key={index}
            className={styles.timelineItem}
            style={{
              borderColor: index % 2 === 0 ? DefaultPalette.green : DefaultPalette.orange,
            }}
          >
            <div style={{position: 'absolute' , top: 16 ,display: 'flex' , flexDirection: 'column' , alignItems: 'center' , gap: 10}}>
            <div
              className={styles.timelineDot}
              style={{
                backgroundColor: index % 2 === 0 ? DefaultPalette.green : DefaultPalette.orange,
              }}
            />
            {index  !==  items.length - 1 &&
            <div style={{border: "1px solid grey" ,height: 29 ,width: 0}} />}
            </div>
            <div className={styles.timelineContent}>
              <Text variant="medium" style={{ fontWeight: 600 }}>
                {item.label}
              </Text>
              <Text variant="small" style={{marginLeft: 10 , color: DefaultPalette.green}}>{item.timestamp}</Text>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderTimeline;
