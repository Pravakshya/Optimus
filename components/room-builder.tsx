"use client"

import { useState, useRef, useCallback } from "react"


export function RoomBuilder(){
  
  return (
    
<div style={{ width: "100%", height: "100vh" }}>
     <iframe
          src="https://planner5d.com/editor?key=b2886a1088091f8cae349bb215c5b43b&accessToken=eyJwcm9qZWN0SGFzaCI6ImIyODg2YTEwODgwOTFmOGNhZTM0OWJiMjE1YzViNDNiIn0%3D.e8b8793804e527d5b5d7d8b69882f5a2"
          width="100%"
          height="100%"
          style={{ border: "none" }}
          title="Room Builder"
          allowFullScreen
        />
        </div>
    
  )
}
