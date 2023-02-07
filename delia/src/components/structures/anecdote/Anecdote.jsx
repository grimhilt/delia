import React, { useState, useEffect } from "react";
import { Nav } from "react-bootstrap";
import { useAnecdote } from "../../../contexts/AnecdoteContext";

export default function Anecdote() {
    const [room, setRoom] = useAnecdote();

    const [nextCycle, setNextCycle] = useState(0);

    useEffect(() => {
        if (room) {
            const last = new Date(room.last);
            last.setSeconds(last.getSeconds() + room.frequency);
            const tmpDate = new Date();
            setNextCycle(last.getTime() - tmpDate.getTime() + tmpDate.getTimezoneOffset());
        }
    }, [room]);

    useEffect(() => {
        if (nextCycle === 0) return;
        let interval = null;
        interval = setInterval(() => {
            setNextCycle(nextCycle - 60 * 1000);
        }, 1000 * 60);

        return () => clearInterval(interval);
    }, [nextCycle]);

    const printTime = (milli) => {
        let tmp;
        let result = "";

        tmp = Math.floor(milli / (1000 * 60 * 60 * 24));
        if (Math.floor(tmp) > 0) result += tmp + "d ";
        milli %= 1000 * 60 * 60 * 24;

        tmp = Math.floor(milli / (1000 * 60 * 60));
        milli %= 1000 * 60 * 60;
        if (tmp > 0) result += tmp + "h ";

        tmp = Math.floor(milli / (1000 * 60));
        milli %= 1000 * 60;
        if (tmp > 0) result += tmp + "m";

        return result;
    };

    const nextCycleStyle = {};
    nextCycleStyle.width = "-moz-available";
    nextCycleStyle["border"] = "#77779b 1px solid";
    nextCycleStyle["textAlign"] = "center";
    nextCycleStyle["padding"] = "5px";
    nextCycleStyle["margin"] = "7px";

    // todo better design when selected
    return (
        <>
            <label style={nextCycleStyle}>
                Next cycle in {printTime(nextCycle)}
            </label>
            <Nav>
                <Nav.Item>
                    <Nav.Link href={"/anecdote/" + room?.id + "/editer"}>
                        Editer
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href={"/anecdote/" + room?.id + "/answers"}>
                        Answers
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href={"/anecdote/" + room?.id + "/results"}>
                        Results
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href={"/anecdote/" + room?.id + "/infos"}>
                        Room Infos
                    </Nav.Link>
                </Nav.Item>
            </Nav>
        </>
    );
}
