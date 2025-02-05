import {State} from "../model/stateEntity";
import {Version} from "../model/types";
import {useEffect, useState} from "react";
import {useModels} from "../contexts/Projects";

export const useModelFromProject = (version: State<Version>) => {
    const [model, setModel] = useState<State<Version>>();
    const models = useModels();

    useEffect(() => {
        if (!version) {
            setModel(undefined);
            return;
        }
        setModel(models.getVersionById(version.grammarId));
    }, [version]);

    return model;
};