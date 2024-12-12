import * as React from 'react';
import { Tile } from '../Tile/Tile';

type HeaderProp = {
title: string 
fontSize?: number
thisMonth?: number
lastMonth?: number 
lifeTime?: number
}


function Header({title ,fontSize ,thisMonth ,lastMonth ,lifeTime}: HeaderProp) {

    return (
        <div >
            <h1 style={{fontSize}}>Product Name: <span style={{ fontWeight: 400 ,color: "green" }}>{title}</span></h1>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Tile title="This Month" value={thisMonth} color="rgb(255 86 48)" iconName="AnalyticsLogo" width='100%' />
                <Tile title="Last Month" value={lastMonth} color="rgb(194 57 179)" iconName="AnalyticsLogo" width='100%' />
                <Tile title="Lifetime" value={lifeTime} color="rgb(255 171 0)" iconName="AnalyticsLogo" width='100%' />
            </div>
        </div>
    )
}

export default Header