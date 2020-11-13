import axiosClient from "@services/utils/axiosUtils";
import {authHeaders} from "@services/utils/authUtils";
import {extractFragment} from "@services/utils/uriIdentifierUtils";

import VocabularyUtils from "@utils/VocabularyUtils";
import JsonLdUtils from "@utils/JsonLdUtils";
import {Gate, CONTEXT as EVENT_CONTEXT, CreateGate, FaultEvent, Event} from "@models/eventModel";
import {CONTEXT as TREE_NODE_CONTEXT} from "@models/treeNodeModel";
import {TreeNode} from "@models/treeNodeModel";

export const findFaultEvents = async (): Promise<FaultEvent[]> => {
    try {
        const response = await axiosClient.get(
            `/events/faultEvents`,
            {
                headers: authHeaders()
            }
        )

        return JsonLdUtils.compactAndResolveReferencesAsArray<FaultEvent>(response.data, EVENT_CONTEXT);
    } catch (e) {
        console.log('Event Service - Failed to call /findFaultEvents')
        return new Promise((resolve, reject) => reject("Failed to find fault events"));
    }
}

export const insertGate = async (treeNodeIri: string, gate: CreateGate): Promise<TreeNode<Gate>> => {
    try {
        const fragment = extractFragment(treeNodeIri);
        const createRequest = Object.assign(
            {"@type": [VocabularyUtils.GATE]}, gate, {"@context": EVENT_CONTEXT}
        )

        const response = await axiosClient.post(
            `/events/${fragment}/gate`,
            createRequest,
            {
                headers: authHeaders()
            }
        )

        return JsonLdUtils.compactAndResolveReferences<TreeNode<Gate>>(response.data, TREE_NODE_CONTEXT);
    } catch (e) {
        console.log('Event Service - Failed to call /insertGate')
        return new Promise((resolve, reject) => reject("Failed to create gate"));
    }
}

export const addEvent = async (treeNodeIri: string, event: FaultEvent): Promise<TreeNode<FaultEvent>> => {
    try {
        const fragment = extractFragment(treeNodeIri);
        let createRequest;
        if (event.iri) {
            console.log('addEvent - using existing event')
            createRequest = Object.assign({}, event, {"@context": EVENT_CONTEXT})
        } else {
            createRequest = Object.assign({"@type": [VocabularyUtils.FAULT_EVENT]}, event, {"@context": EVENT_CONTEXT})
        }

        const response = await axiosClient.post(
            `/events/${fragment}/inputEvents`,
            createRequest,
            {
                headers: authHeaders()
            }
        )

        return JsonLdUtils.compactAndResolveReferences<TreeNode<FaultEvent>>(response.data, TREE_NODE_CONTEXT);
    } catch (e) {
        console.log('Event Service - Failed to call /addEvent')
        return new Promise((resolve, reject) => reject("Failed to create event"));
    }
}

export const updateNode = async (node: TreeNode<Event>): Promise<void> => {
    try {
        const updateRequest = Object.assign({}, node, {"@context": TREE_NODE_CONTEXT})

        await axiosClient.put(
            '/events',
            updateRequest,
            {
                headers: authHeaders()
            }
        )
        return new Promise((resolve) => resolve());
    } catch (e) {
        console.log('Failure Mode Service - Failed to call /update')
        return new Promise((resolve, reject) => reject("Failed to update tree node"));
    }
}