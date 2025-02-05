import * as React from "react";
import {Button, Col, Divider, Form, message, Row} from "antd";
import GrammarSelectionFormItems from "../GrammarSelectionFormItems";
import {Project, ProjectLevel, Version} from "../../../model/types";
import GeneralProjectFormItems from "../GeneralProjectFormItems";
import {ArrayState} from "../../../model/stateArray";
import {FormComponentProps} from "antd/lib/form";
import {ROUTES} from "../../../constants/routes";


export interface NewM0ProjectFormProps {
    history: any;
    versions: ArrayState<Version>;
    models: ArrayState<Project>;
}

class NewM0ProjectForm extends React.Component<NewM0ProjectFormProps & FormComponentProps> {

    private getGrammar = (versionId: number): Version | undefined => {
        return this.props.models.getEntityArray().map(model => model.versions)
            .reduce((old, next) => old.concat(next), [])
            .find((version: Version) => version.id == versionId);
    };

    private handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const grammar = this.getGrammar(values.grammarId);
                if (grammar === undefined)
                    return;
                const newVersion = {
                    description: "",
                    version: "1.0.0",
                    grammar: grammar,
                    project: {
                        name: values.name,
                        level: ProjectLevel.M0,
                        description: values.description,
                        visibilityLevel: values.visibilityLevel
                    }
                };
                this.props.versions.add(newVersion).then((version: Required<Version>) => {
                    message.success(`Project ${version.project.name} was created`);
                    this.props.history.push(`${ROUTES.VERSIONS}/${version.id}`);
                }).catch((error: Error) => {
                    message.error(error.toString());
                });
            }
        });
    };

    render() {
        const {models} = this.props;
        const {form} = this.props;
        return (
            <Form onSubmit={this.handleSubmit}>
                <Row justify={"center"}>
                    <Col span={8}>
                        <GeneralProjectFormItems getFieldDecorator={form.getFieldDecorator} />
                        <h3>Model:</h3>
                        <GrammarSelectionFormItems
                                grammars={models.getEntityArray()}
                                metaName={"Model"}
                                getFieldDecorator={form.getFieldDecorator}
                            />
                        <Divider/>
                        <Button type="primary" htmlType="submit">Create project</Button>
                    </Col>
                </Row>
            </Form>
        )
    }
}

export default Form.create<NewM0ProjectFormProps & FormComponentProps>()(NewM0ProjectForm);