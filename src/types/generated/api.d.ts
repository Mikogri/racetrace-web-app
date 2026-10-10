// Generated from the backend OpenAPI document. Do not edit.
export interface paths {
    "/api/admin/editable-resources": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["JsonObject"];
                        "text/json": components["schemas"]["JsonObject"];
                        "text/plain": components["schemas"]["JsonObject"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/admin/fantasy/prepare": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: {
                    "Idempotency-Key"?: string;
                };
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["FantasyPreparedRound"];
                        "text/json": components["schemas"]["FantasyPreparedRound"];
                        "text/plain": components["schemas"]["FantasyPreparedRound"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/admin/fantasy/sync": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: {
                    prepare?: boolean;
                };
                header?: {
                    "Idempotency-Key"?: string;
                };
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["JsonObject"];
                        "text/json": components["schemas"]["JsonObject"];
                        "text/plain": components["schemas"]["JsonObject"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/admin/fantasy/sync-html": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: {
                    "Idempotency-Key"?: string;
                };
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "text/html": string;
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["JsonObject"];
                        "text/json": components["schemas"]["JsonObject"];
                        "text/plain": components["schemas"]["JsonObject"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Uploaded request exceeds the configured size limit. */
                413: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/admin/import/chronorace/round-form": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/*+json": components["schemas"]["ChronoRaceRoundFormImportRequest"];
                    "application/json": components["schemas"]["ChronoRaceRoundFormImportRequest"];
                    "text/json": components["schemas"]["ChronoRaceRoundFormImportRequest"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ChronoRaceRoundFormImportResponse"];
                        "text/json": components["schemas"]["ChronoRaceRoundFormImportResponse"];
                        "text/plain": components["schemas"]["ChronoRaceRoundFormImportResponse"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/admin/import/chronorace/session": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/*+json": components["schemas"]["ChronoRaceImportRequest"];
                    "application/json": components["schemas"]["ChronoRaceImportRequest"];
                    "text/json": components["schemas"]["ChronoRaceImportRequest"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ChronoRaceImportResponse"];
                        "text/json": components["schemas"]["ChronoRaceImportResponse"];
                        "text/plain": components["schemas"]["ChronoRaceImportResponse"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/admin/import/results/round-form": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/*+json": components["schemas"]["ChronoRaceRoundFormImportRequest"];
                    "application/json": components["schemas"]["ChronoRaceRoundFormImportRequest"];
                    "text/json": components["schemas"]["ChronoRaceRoundFormImportRequest"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ChronoRaceRoundFormImportResponse"];
                        "text/json": components["schemas"]["ChronoRaceRoundFormImportResponse"];
                        "text/plain": components["schemas"]["ChronoRaceRoundFormImportResponse"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/admin/import/results/round-form/pdf": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/x-www-form-urlencoded": {
                        request?: string;
                    } & {
                        files?: components["schemas"]["IFormFile"][];
                    };
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ChronoRaceRoundFormImportResponse"];
                        "text/json": components["schemas"]["ChronoRaceRoundFormImportResponse"];
                        "text/plain": components["schemas"]["ChronoRaceRoundFormImportResponse"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Uploaded request exceeds the configured size limit. */
                413: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/admin/import/results/session": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/*+json": components["schemas"]["ChronoRaceImportRequest"];
                    "application/json": components["schemas"]["ChronoRaceImportRequest"];
                    "text/json": components["schemas"]["ChronoRaceImportRequest"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ChronoRaceImportResponse"];
                        "text/json": components["schemas"]["ChronoRaceImportResponse"];
                        "text/plain": components["schemas"]["ChronoRaceImportResponse"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/admin/import/riders/profile-images": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/x-www-form-urlencoded": {
                        files?: components["schemas"]["IFormFile"][];
                    };
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["RiderProfileImageImportResponse"];
                        "text/json": components["schemas"]["RiderProfileImageImportResponse"];
                        "text/plain": components["schemas"]["RiderProfileImageImportResponse"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/admin/points/recalculate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/*+json": components["schemas"]["PointsRecalculateRequest"];
                    "application/json": components["schemas"]["PointsRecalculateRequest"];
                    "text/json": components["schemas"]["PointsRecalculateRequest"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["JsonObject"];
                        "text/json": components["schemas"]["JsonObject"];
                        "text/plain": components["schemas"]["JsonObject"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/admin/preaggregations/refresh": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/*+json": components["schemas"]["RankingPreaggregationRefreshRequest"];
                    "application/json": components["schemas"]["RankingPreaggregationRefreshRequest"];
                    "text/json": components["schemas"]["RankingPreaggregationRefreshRequest"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["JsonObject"];
                        "text/json": components["schemas"]["JsonObject"];
                        "text/plain": components["schemas"]["JsonObject"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/admin/riders/{riderId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    riderId: number;
                };
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/*+json": null | components["schemas"]["JsonObject"];
                    "application/json": null | components["schemas"]["JsonObject"];
                    "text/json": null | components["schemas"]["JsonObject"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["JsonObject"];
                        "text/json": components["schemas"]["JsonObject"];
                        "text/plain": components["schemas"]["JsonObject"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        trace?: never;
    };
    "/api/admin/rounds": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/*+json": components["schemas"]["PlannedRoundCreateRequest"];
                    "application/json": components["schemas"]["PlannedRoundCreateRequest"];
                    "text/json": components["schemas"]["PlannedRoundCreateRequest"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["PlannedRoundCreateResponse"];
                        "text/json": components["schemas"]["PlannedRoundCreateResponse"];
                        "text/plain": components["schemas"]["PlannedRoundCreateResponse"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/admin/rounds/{roundId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    roundId: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["JsonObject"];
                        "text/json": components["schemas"]["JsonObject"];
                        "text/plain": components["schemas"]["JsonObject"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/admin/rounds/{roundId}/image": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    roundId: number;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/*+json": components["schemas"]["ImportRoundImagePayload"];
                    "application/json": components["schemas"]["ImportRoundImagePayload"];
                    "text/json": components["schemas"]["ImportRoundImagePayload"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["JsonObject"];
                        "text/json": components["schemas"]["JsonObject"];
                        "text/plain": components["schemas"]["JsonObject"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/admin/rounds/{roundId}/track": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    roundId: number;
                };
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/*+json": null | components["schemas"]["JsonObject"];
                    "application/json": null | components["schemas"]["JsonObject"];
                    "text/json": null | components["schemas"]["JsonObject"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["JsonObject"];
                        "text/json": components["schemas"]["JsonObject"];
                        "text/plain": components["schemas"]["JsonObject"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        trace?: never;
    };
    "/api/admin/sessions/{sessionId}/reimport": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    sessionId: number;
                };
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/*+json": null | components["schemas"]["ChronoRaceSessionReimportRequest"];
                    "application/json": null | components["schemas"]["ChronoRaceSessionReimportRequest"];
                    "text/json": null | components["schemas"]["ChronoRaceSessionReimportRequest"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ChronoRaceSessionReimportResponse"];
                        "text/json": components["schemas"]["ChronoRaceSessionReimportResponse"];
                        "text/plain": components["schemas"]["ChronoRaceSessionReimportResponse"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/admin/sessions/{sessionId}/supplement/uci-mtb-world-series": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    sessionId: number;
                };
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/*+json": null | components["schemas"]["JsonObject"];
                    "application/json": null | components["schemas"]["JsonObject"];
                    "text/json": null | components["schemas"]["JsonObject"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["UciMtbWorldSeriesSupplementResponse"];
                        "text/json": components["schemas"]["UciMtbWorldSeriesSupplementResponse"];
                        "text/plain": components["schemas"]["UciMtbWorldSeriesSupplementResponse"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/admin/{resource}/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    resource: string;
                    id: number;
                };
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/*+json": null | components["schemas"]["JsonObject"];
                    "application/json": null | components["schemas"]["JsonObject"];
                    "text/json": null | components["schemas"]["JsonObject"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["JsonObject"];
                        "text/json": components["schemas"]["JsonObject"];
                        "text/plain": components["schemas"]["JsonObject"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        trace?: never;
    };
    "/api/v1/analytics/rider-similarity": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    season?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    seasons?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    seasonYears?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    season_years?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    seasonYear?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    season_year?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    trackId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    track_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    tracks?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venueId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venue_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venue?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venueName?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venue_name?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    countryCode?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    country_code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    category?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    categories?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    categoryCode?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    categoryCodes?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    category_code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    category_codes?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sessionType?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    session_type?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    dateFrom?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    date_from?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    from_date?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    dateTo?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    date_to?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    to_date?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competitionClassId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competition_class_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competitionClassCode?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competition_class_code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    class?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    conditionId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    condition_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    conditions?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    condition?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    roundId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    round_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    status?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    trackName?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    track_name?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    minSectors?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    min_sectors?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    minSessions?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    min_sessions?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    minSharedFeatures?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    min_shared_features?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    clusterCount?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    cluster_count?: number;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["RiderSimilarityResponseDto"];
                        "text/json": components["schemas"]["RiderSimilarityResponseDto"];
                        "text/plain": components["schemas"]["RiderSimilarityResponseDto"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/analytics/riders/{riderId}/pressure-performance": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    season?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    seasons?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    seasonYears?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    season_years?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    seasonYear?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    season_year?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    trackId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    track_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    tracks?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venueId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venue_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venue?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venueName?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venue_name?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    countryCode?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    country_code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    category?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    categories?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    categoryCode?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    categoryCodes?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    category_code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    category_codes?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sessionType?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    session_type?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    dateFrom?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    date_from?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    from_date?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    dateTo?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    date_to?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    to_date?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competitionClassId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competition_class_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competitionClassCode?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competition_class_code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    class?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    conditionId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    condition_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    conditions?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    condition?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    roundId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    round_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    status?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    trackName?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    track_name?: string;
                };
                header?: never;
                path: {
                    riderId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["PressurePerformanceResponseDto"];
                        "text/json": components["schemas"]["PressurePerformanceResponseDto"];
                        "text/plain": components["schemas"]["PressurePerformanceResponseDto"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/analytics/round-profile": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    season?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    seasons?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    seasonYears?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    season_years?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    seasonYear?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    season_year?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    trackId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    track_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    tracks?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venueId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venue_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venue?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venueName?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venue_name?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    countryCode?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    country_code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    category?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    categories?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    categoryCode?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    categoryCodes?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    category_code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    category_codes?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sessionType?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    session_type?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    dateFrom?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    date_from?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    from_date?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    dateTo?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    date_to?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    to_date?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competitionClassId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competition_class_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competitionClassCode?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competition_class_code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    class?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    conditionId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    condition_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    conditions?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    condition?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    roundId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    round_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    status?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    trackName?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    track_name?: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["RoundProfileResponseDto"];
                        "text/json": components["schemas"]["RoundProfileResponseDto"];
                        "text/plain": components["schemas"]["RoundProfileResponseDto"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/compare": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    season?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    seasons?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    seasonYears?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    season_years?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    seasonYear?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    season_year?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    trackId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    track_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    tracks?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venueId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venue_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venue?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venueName?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venue_name?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    countryCode?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    country_code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    category?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    categories?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    categoryCode?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    categoryCodes?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    category_code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    category_codes?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sessionType?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    session_type?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    dateFrom?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    date_from?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    from_date?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    dateTo?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    date_to?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    to_date?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competitionClassId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competition_class_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competitionClassCode?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competition_class_code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    class?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    conditionId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    condition_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    conditions?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    condition?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    roundId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    round_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    status?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    trackName?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    track_name?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    riderIds?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    rider_ids?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    riderId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    rider_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    riders?: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["CompareResponseDto"];
                        "text/json": components["schemas"]["CompareResponseDto"];
                        "text/plain": components["schemas"]["CompareResponseDto"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/competition-classes": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    is_active?: boolean;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ListResponseOfJsonObject"];
                        "text/json": components["schemas"]["ListResponseOfJsonObject"];
                        "text/plain": components["schemas"]["ListResponseOfJsonObject"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/conditions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    page?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    pageSize?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    page_size?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    limit?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sortBy?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sort_by?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sort?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sortDirection?: "asc" | "desc";
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sort_direction?: "asc" | "desc";
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    order?: "asc" | "desc";
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    is_dry?: boolean;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    q?: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ListResponseOfJsonObject"];
                        "text/json": components["schemas"]["ListResponseOfJsonObject"];
                        "text/plain": components["schemas"]["ListResponseOfJsonObject"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/fantasy/current": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["FantasyCurrentDto"];
                        "text/json": components["schemas"]["FantasyCurrentDto"];
                        "text/plain": components["schemas"]["FantasyCurrentDto"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/fantasy/recommendation": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["FantasyCurrentDto"];
                        "text/json": components["schemas"]["FantasyCurrentDto"];
                        "text/plain": components["schemas"]["FantasyCurrentDto"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/fantasy/riders": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["FantasyRiderDto"][];
                        "text/json": components["schemas"]["FantasyRiderDto"][];
                        "text/plain": components["schemas"]["FantasyRiderDto"][];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/fantasy/rules": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["FantasyRulesDto"];
                        "text/json": components["schemas"]["FantasyRulesDto"];
                        "text/plain": components["schemas"]["FantasyRulesDto"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/import/riders/profile-images": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/x-www-form-urlencoded": {
                        files?: components["schemas"]["IFormFile"][];
                    };
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["RiderProfileImageImportResponse"];
                        "text/json": components["schemas"]["RiderProfileImageImportResponse"];
                        "text/plain": components["schemas"]["RiderProfileImageImportResponse"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                422: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/live/chronorace/catalog/{context}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    context: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["JsonNode"];
                        "text/json": components["schemas"]["JsonNode"];
                        "text/plain": components["schemas"]["JsonNode"];
                    };
                };
                /** @description The timing provider returned no payload. */
                204: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/live/chronorace/results/{context}/{key}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    context: string;
                    key: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["JsonNode"];
                        "text/json": components["schemas"]["JsonNode"];
                        "text/plain": components["schemas"]["JsonNode"];
                    };
                };
                /** @description The timing provider returned no payload. */
                204: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/live/rounds/{roundId}/championship": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    category?: string;
                };
                header?: never;
                path: {
                    roundId: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ChampionshipContext"];
                        "text/json": components["schemas"]["ChampionshipContext"];
                        "text/plain": components["schemas"]["ChampionshipContext"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post: {
            parameters: {
                query?: {
                    category?: string;
                };
                header?: never;
                path: {
                    roundId: number;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/*+json": components["schemas"]["ChampionshipSession"][];
                    "application/json": components["schemas"]["ChampionshipSession"][];
                    "text/json": components["schemas"]["ChampionshipSession"][];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ChampionshipProjection"];
                        "text/json": components["schemas"]["ChampionshipProjection"];
                        "text/plain": components["schemas"]["ChampionshipProjection"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Uploaded request exceeds the configured size limit. */
                413: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/live/sessions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    season?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    seasons?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    seasonYears?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    season_years?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    seasonYear?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    season_year?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    trackId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    track_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    tracks?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venueId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venue_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venue?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venueName?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venue_name?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    countryCode?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    country_code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    category?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    categories?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    categoryCode?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    categoryCodes?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    category_code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    category_codes?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sessionType?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    session_type?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    dateFrom?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    date_from?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    from_date?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    dateTo?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    date_to?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    to_date?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competitionClassId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competition_class_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competitionClassCode?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competition_class_code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    class?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    conditionId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    condition_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    conditions?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    condition?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    roundId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    round_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    status?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    trackName?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    track_name?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sortBy?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sort_by?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sort?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sortDirection?: "asc" | "desc";
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sort_direction?: "asc" | "desc";
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    order?: "asc" | "desc";
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ListResponseOfJsonObject"];
                        "text/json": components["schemas"]["ListResponseOfJsonObject"];
                        "text/plain": components["schemas"]["ListResponseOfJsonObject"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/live/sessions/{sessionId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    include?: string;
                };
                header?: never;
                path: {
                    sessionId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["JsonObject"];
                        "text/json": components["schemas"]["JsonObject"];
                        "text/plain": components["schemas"]["JsonObject"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/live/sessions/{sessionId}/leaderboard": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    page?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    pageSize?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    page_size?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    limit?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sortBy?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sort_by?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sort?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sortDirection?: "asc" | "desc";
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sort_direction?: "asc" | "desc";
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    order?: "asc" | "desc";
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    category?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    categoryCode?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    category_code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sessionType?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    session_type?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    search?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    q?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    countryCode?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    country_code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    nation?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    status?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    min_race_time_ms?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    max_race_time_ms?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    min_top_speed?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    max_top_speed?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    min_gap_ms?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    max_gap_ms?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    timeView?: "sectors" | "splits";
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    time_view?: "sectors" | "splits";
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    timing_mode?: "sectors" | "splits";
                };
                header?: never;
                path: {
                    sessionId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ListResponseOfJsonObject"];
                        "text/json": components["schemas"]["ListResponseOfJsonObject"];
                        "text/plain": components["schemas"]["ListResponseOfJsonObject"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/metadata": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["DisplayMetadataDto"];
                        "text/json": components["schemas"]["DisplayMetadataDto"];
                        "text/plain": components["schemas"]["DisplayMetadataDto"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/podium-predictor": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    season?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    seasonYear?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    season_year?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    category?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    categoryCode?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    category_code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    roundId?: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["PodiumPredictionResponseDto"];
                        "text/json": components["schemas"]["PodiumPredictionResponseDto"];
                        "text/plain": components["schemas"]["PodiumPredictionResponseDto"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/points/systems": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    season_year?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    discipline?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    category_code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competition_class_code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    session_type?: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ListResponseOfJsonObject"];
                        "text/json": components["schemas"]["ListResponseOfJsonObject"];
                        "text/plain": components["schemas"]["ListResponseOfJsonObject"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/ranking": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    season?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    seasons?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    seasonYears?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    season_years?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    seasonYear?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    season_year?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    trackId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    track_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    tracks?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venueId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venue_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venue?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venueName?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venue_name?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    countryCode?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    country_code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    category?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    categories?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    categoryCode?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    categoryCodes?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    category_code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    category_codes?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sessionType?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    session_type?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    dateFrom?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    date_from?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    from_date?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    dateTo?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    date_to?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    to_date?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competitionClassId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competition_class_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competitionClassCode?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competition_class_code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    class?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    conditionId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    condition_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    conditions?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    condition?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    roundId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    round_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    status?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    trackName?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    track_name?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    page?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    pageSize?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    page_size?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    limit?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sortBy?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sort_by?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sort?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sortDirection?: "asc" | "desc";
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sort_direction?: "asc" | "desc";
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    order?: "asc" | "desc";
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    search?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    q?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    nation?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    comparison?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    comparisonSeason?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    comparisonTrackId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    comparisonConditionId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    comparisonCompetitionClassId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    comparisonCategory?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    minRating?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    min_rating?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    maxRating?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    max_rating?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    minPace?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    min_pace?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    maxPace?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    max_pace?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    minConsistency?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    min_consistency?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    maxConsistency?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    max_consistency?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    confidence?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    minConfidence?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    min_confidence?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    maxConfidence?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    max_confidence?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    minPoints?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    min_points?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    maxPoints?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    max_points?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    minStarts?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    min_starts?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    maxStarts?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    max_starts?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    minFinalStarts?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    min_final_starts?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    maxFinalStarts?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    max_final_starts?: number;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["RankingResponseDto"];
                        "text/json": components["schemas"]["RankingResponseDto"];
                        "text/plain": components["schemas"]["RankingResponseDto"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/results/{resultId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    include?: string;
                };
                header?: never;
                path: {
                    resultId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["JsonObject"];
                        "text/json": components["schemas"]["JsonObject"];
                        "text/plain": components["schemas"]["JsonObject"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/results/{resultId}/time-splits": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sortBy?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sort_by?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sort?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sortDirection?: "asc" | "desc";
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sort_direction?: "asc" | "desc";
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    order?: "asc" | "desc";
                };
                header?: never;
                path: {
                    resultId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ListResponseOfJsonObject"];
                        "text/json": components["schemas"]["ListResponseOfJsonObject"];
                        "text/plain": components["schemas"]["ListResponseOfJsonObject"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/riders": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    season?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    seasons?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    seasonYears?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    season_years?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    seasonYear?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    season_year?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    trackId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    track_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    tracks?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venueId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venue_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venue?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venueName?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venue_name?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    countryCode?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    country_code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    category?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    categories?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    categoryCode?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    categoryCodes?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    category_code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    category_codes?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sessionType?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    session_type?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    dateFrom?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    date_from?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    from_date?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    dateTo?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    date_to?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    to_date?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competitionClassId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competition_class_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competitionClassCode?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competition_class_code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    class?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    conditionId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    condition_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    conditions?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    condition?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    roundId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    round_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    status?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    trackName?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    track_name?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    page?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    pageSize?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    page_size?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    limit?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sortBy?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sort_by?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sort?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sortDirection?: "asc" | "desc";
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sort_direction?: "asc" | "desc";
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    order?: "asc" | "desc";
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    search?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    q?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    nation?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    comparison?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    comparisonSeason?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    comparisonTrackId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    comparisonConditionId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    comparisonCompetitionClassId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    comparisonCategory?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    minRating?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    min_rating?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    maxRating?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    max_rating?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    minPace?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    min_pace?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    maxPace?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    max_pace?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    minConsistency?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    min_consistency?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    maxConsistency?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    max_consistency?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    confidence?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    minConfidence?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    min_confidence?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    maxConfidence?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    max_confidence?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    minPoints?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    min_points?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    maxPoints?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    max_points?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    minStarts?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    min_starts?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    maxStarts?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    max_starts?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    minFinalStarts?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    min_final_starts?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    maxFinalStarts?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    max_final_starts?: number;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["RankingResponseDto"];
                        "text/json": components["schemas"]["RankingResponseDto"];
                        "text/plain": components["schemas"]["RankingResponseDto"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/riders/resolve": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    uciIds?: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["JsonObject"];
                        "text/json": components["schemas"]["JsonObject"];
                        "text/plain": components["schemas"]["JsonObject"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/riders/{riderId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    season?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    seasons?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    seasonYears?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    season_years?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    seasonYear?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    season_year?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    trackId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    track_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    tracks?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venueId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venue_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venue?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venueName?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venue_name?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    countryCode?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    country_code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    category?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    categories?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    categoryCode?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    categoryCodes?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    category_code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    category_codes?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sessionType?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    session_type?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    dateFrom?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    date_from?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    from_date?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    dateTo?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    date_to?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    to_date?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competitionClassId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competition_class_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competitionClassCode?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competition_class_code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    class?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    conditionId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    condition_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    conditions?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    condition?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    roundId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    round_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    status?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    trackName?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    track_name?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    include?: string;
                };
                header?: never;
                path: {
                    riderId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["JsonObject"];
                        "text/json": components["schemas"]["JsonObject"];
                        "text/plain": components["schemas"]["JsonObject"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/riders/{riderId}/metrics": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    season?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    seasons?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    seasonYears?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    season_years?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    seasonYear?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    season_year?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    trackId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    track_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    tracks?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venueId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venue_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venue?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venueName?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venue_name?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    countryCode?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    country_code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    category?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    categories?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    categoryCode?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    categoryCodes?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    category_code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    category_codes?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sessionType?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    session_type?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    dateFrom?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    date_from?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    from_date?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    dateTo?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    date_to?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    to_date?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competitionClassId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competition_class_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competitionClassCode?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competition_class_code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    class?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    conditionId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    condition_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    conditions?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    condition?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    roundId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    round_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    status?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    trackName?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    track_name?: string;
                };
                header?: never;
                path: {
                    riderId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["RiderStatisticsDto"];
                        "text/json": components["schemas"]["RiderStatisticsDto"];
                        "text/plain": components["schemas"]["RiderStatisticsDto"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/riders/{riderId}/overview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    season?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    seasons?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    seasonYears?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    season_years?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    seasonYear?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    season_year?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    trackId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    track_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    tracks?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venueId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venue_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venue?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venueName?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venue_name?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    countryCode?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    country_code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    category?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    categories?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    categoryCode?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    categoryCodes?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    category_code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    category_codes?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sessionType?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    session_type?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    dateFrom?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    date_from?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    from_date?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    dateTo?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    date_to?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    to_date?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competitionClassId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competition_class_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competitionClassCode?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competition_class_code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    class?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    conditionId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    condition_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    conditions?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    condition?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    roundId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    round_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    status?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    trackName?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    track_name?: string;
                };
                header?: never;
                path: {
                    riderId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["RiderOverviewDto"];
                        "text/json": components["schemas"]["RiderOverviewDto"];
                        "text/plain": components["schemas"]["RiderOverviewDto"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/riders/{riderId}/results": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    season?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    seasons?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    seasonYears?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    season_years?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    seasonYear?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    season_year?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    trackId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    track_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    tracks?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venueId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venue_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venue?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venueName?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venue_name?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    countryCode?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    country_code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    category?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    categories?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    categoryCode?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    categoryCodes?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    category_code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    category_codes?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sessionType?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    session_type?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    dateFrom?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    date_from?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    from_date?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    dateTo?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    date_to?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    to_date?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competitionClassId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competition_class_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competitionClassCode?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competition_class_code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    class?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    conditionId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    condition_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    conditions?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    condition?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    roundId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    round_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    status?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    trackName?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    track_name?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    page?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    pageSize?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    page_size?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    limit?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sortBy?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sort_by?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sort?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sortDirection?: "asc" | "desc";
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sort_direction?: "asc" | "desc";
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    order?: "asc" | "desc";
                };
                header?: never;
                path: {
                    riderId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["PublicPagedResponseOfRiderRoundResultDto"];
                        "text/json": components["schemas"]["PublicPagedResponseOfRiderRoundResultDto"];
                        "text/plain": components["schemas"]["PublicPagedResponseOfRiderRoundResultDto"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/riders/{riderId}/team-history": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    dateFrom?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    date_from?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    from_date?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    dateTo?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    date_to?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    to_date?: string;
                };
                header?: never;
                path: {
                    riderId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["RiderTeamHistoryDto"][];
                        "text/json": components["schemas"]["RiderTeamHistoryDto"][];
                        "text/plain": components["schemas"]["RiderTeamHistoryDto"][];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/riders/{riderId}/venues": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    season?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    seasons?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    seasonYears?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    season_years?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    seasonYear?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    season_year?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    trackId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    track_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    tracks?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venueId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venue_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venue?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venueName?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venue_name?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    countryCode?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    country_code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    category?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    categories?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    categoryCode?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    categoryCodes?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    category_code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    category_codes?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sessionType?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    session_type?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    dateFrom?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    date_from?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    from_date?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    dateTo?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    date_to?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    to_date?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competitionClassId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competition_class_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competitionClassCode?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competition_class_code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    class?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    conditionId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    condition_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    conditions?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    condition?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    roundId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    round_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    status?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    trackName?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    track_name?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    page?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    pageSize?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    page_size?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    limit?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sortBy?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sort_by?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sort?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sortDirection?: "asc" | "desc";
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sort_direction?: "asc" | "desc";
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    order?: "asc" | "desc";
                };
                header?: never;
                path: {
                    riderId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["PublicPagedResponseOfRiderTrackStatisticsDto"];
                        "text/json": components["schemas"]["PublicPagedResponseOfRiderTrackStatisticsDto"];
                        "text/plain": components["schemas"]["PublicPagedResponseOfRiderTrackStatisticsDto"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/rounds": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    page?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    pageSize?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    page_size?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    limit?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sortBy?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sort_by?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sort?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sortDirection?: "asc" | "desc";
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sort_direction?: "asc" | "desc";
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    order?: "asc" | "desc";
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    season?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    seasonYear?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    season_year?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    search?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    q?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competitionClassCode?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competition_class_code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competitionClassId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competition_class_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    countryCode?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    country_code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venueName?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venue?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    trackName?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    track_name?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    status?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    category?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    categoryCode?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    category_code?: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["PublicPagedResponseOfRoundListItemDto"];
                        "text/json": components["schemas"]["PublicPagedResponseOfRoundListItemDto"];
                        "text/plain": components["schemas"]["PublicPagedResponseOfRoundListItemDto"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/rounds/seasons": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["JsonObject"];
                        "text/json": components["schemas"]["JsonObject"];
                        "text/plain": components["schemas"]["JsonObject"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/rounds/{roundId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    include?: string;
                };
                header?: never;
                path: {
                    roundId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["JsonObject"];
                        "text/json": components["schemas"]["JsonObject"];
                        "text/plain": components["schemas"]["JsonObject"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/rounds/{roundId}/image": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    roundId: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Round image bytes. */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "image/*": string;
                    };
                };
                /** @description Redirect to stored round image. */
                302: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Image not available. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/rounds/{roundId}/results": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    page?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    pageSize?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    page_size?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    limit?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sortBy?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sort_by?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sort?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sortDirection?: "asc" | "desc";
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sort_direction?: "asc" | "desc";
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    order?: "asc" | "desc";
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    category?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    categoryCode?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    category_code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sessionType?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    session_type?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    search?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    q?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    countryCode?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    country_code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    nation?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    status?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    min_race_time_ms?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    max_race_time_ms?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    min_top_speed?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    max_top_speed?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    min_gap_ms?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    max_gap_ms?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    timeView?: "sectors" | "splits";
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    time_view?: "sectors" | "splits";
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    timing_mode?: "sectors" | "splits";
                };
                header?: never;
                path: {
                    roundId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["SessionResultsResponseDto"];
                        "text/json": components["schemas"]["SessionResultsResponseDto"];
                        "text/plain": components["schemas"]["SessionResultsResponseDto"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/rounds/{roundId}/sessions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    page?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    pageSize?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    page_size?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    limit?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sortBy?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sort_by?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sort?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sortDirection?: "asc" | "desc";
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sort_direction?: "asc" | "desc";
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    order?: "asc" | "desc";
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    category?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    categoryCode?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    category_code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    status?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sessionType?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    session_type?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    type?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    search?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    q?: string;
                };
                header?: never;
                path: {
                    roundId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["PublicPagedResponseOfCommonSessionDto"];
                        "text/json": components["schemas"]["PublicPagedResponseOfCommonSessionDto"];
                        "text/plain": components["schemas"]["PublicPagedResponseOfCommonSessionDto"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    q?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    type?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    limit?: number;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["JsonObject"];
                        "text/json": components["schemas"]["JsonObject"];
                        "text/plain": components["schemas"]["JsonObject"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/seasons/{season}/overview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    season: number;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["SeasonOverviewResponseDto"];
                        "text/json": components["schemas"]["SeasonOverviewResponseDto"];
                        "text/plain": components["schemas"]["SeasonOverviewResponseDto"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/sessions/common": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    season?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    seasons?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    seasonYears?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    season_years?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    seasonYear?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    season_year?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    trackId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    track_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    tracks?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venueId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venue_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venue?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venueName?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venue_name?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    countryCode?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    country_code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    category?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    categories?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    categoryCode?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    categoryCodes?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    category_code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    category_codes?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sessionType?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    session_type?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    dateFrom?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    date_from?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    from_date?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    dateTo?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    date_to?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    to_date?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competitionClassId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competition_class_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competitionClassCode?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competition_class_code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    class?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    conditionId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    condition_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    conditions?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    condition?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    roundId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    round_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    status?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    trackName?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    track_name?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    page?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    pageSize?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    page_size?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    limit?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sortBy?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sort_by?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sort?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sortDirection?: "asc" | "desc";
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sort_direction?: "asc" | "desc";
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    order?: "asc" | "desc";
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    riderId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    rider_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    commonSessionsOnly?: boolean;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    common_sessions_only?: boolean;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["PublicPagedResponseOfCommonSessionDto"];
                        "text/json": components["schemas"]["PublicPagedResponseOfCommonSessionDto"];
                        "text/plain": components["schemas"]["PublicPagedResponseOfCommonSessionDto"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/sessions/{sessionId}/results": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    page?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    pageSize?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    page_size?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    limit?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sortBy?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sort_by?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sort?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sortDirection?: "asc" | "desc";
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sort_direction?: "asc" | "desc";
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    order?: "asc" | "desc";
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    category?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    categoryCode?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    category_code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sessionType?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    session_type?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    search?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    q?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    countryCode?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    country_code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    nation?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    status?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    min_race_time_ms?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    max_race_time_ms?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    min_top_speed?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    max_top_speed?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    min_gap_ms?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    max_gap_ms?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    timeView?: "sectors" | "splits";
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    time_view?: "sectors" | "splits";
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    timing_mode?: "sectors" | "splits";
                };
                header?: never;
                path: {
                    sessionId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["SessionResultsResponseDto"];
                        "text/json": components["schemas"]["SessionResultsResponseDto"];
                        "text/plain": components["schemas"]["SessionResultsResponseDto"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/teams": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    page?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    pageSize?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    page_size?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    limit?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sortBy?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sort_by?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sort?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sortDirection?: "asc" | "desc";
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sort_direction?: "asc" | "desc";
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    order?: "asc" | "desc";
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    q?: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ListResponseOfJsonObject"];
                        "text/json": components["schemas"]["ListResponseOfJsonObject"];
                        "text/plain": components["schemas"]["ListResponseOfJsonObject"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/teams/{teamId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    teamId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["JsonObject"];
                        "text/json": components["schemas"]["JsonObject"];
                        "text/plain": components["schemas"]["JsonObject"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/tracks": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    page?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    pageSize?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    page_size?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    limit?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sortBy?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sort_by?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sort?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sortDirection?: "asc" | "desc";
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sort_direction?: "asc" | "desc";
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    order?: "asc" | "desc";
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    countryCode?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    country_code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venueName?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venue?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    trackName?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    name?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    min_length_m?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    max_length_m?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    min_avg_slope?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    max_avg_slope?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    search?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    q?: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["PublicPagedResponseOfTrackFilterOptionDto"];
                        "text/json": components["schemas"]["PublicPagedResponseOfTrackFilterOptionDto"];
                        "text/plain": components["schemas"]["PublicPagedResponseOfTrackFilterOptionDto"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/tracks/{trackId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    season?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    seasons?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    seasonYears?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    season_years?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    seasonYear?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    season_year?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    track_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    tracks?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venueId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venue_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venue?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venueName?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venue_name?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    countryCode?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    country_code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    category?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    categories?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    categoryCode?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    categoryCodes?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    category_code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    category_codes?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sessionType?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    session_type?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    dateFrom?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    date_from?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    from_date?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    dateTo?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    date_to?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    to_date?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competitionClassId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competition_class_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competitionClassCode?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competition_class_code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    class?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    conditionId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    condition_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    conditions?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    condition?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    roundId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    round_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    status?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    trackName?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    track_name?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    include?: string;
                };
                header?: never;
                path: {
                    trackId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["JsonObject"];
                        "text/json": components["schemas"]["JsonObject"];
                        "text/plain": components["schemas"]["JsonObject"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/tracks/{trackId}/records": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    season?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    seasons?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    seasonYears?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    season_years?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    seasonYear?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    season_year?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    track_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    tracks?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venueId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venue_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venue?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venueName?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    venue_name?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    countryCode?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    country_code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    category?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    categories?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    categoryCode?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    categoryCodes?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    category_code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    category_codes?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sessionType?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    session_type?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    dateFrom?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    date_from?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    from_date?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    dateTo?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    date_to?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    to_date?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competitionClassId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competition_class_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competitionClassCode?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    competition_class_code?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    class?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    conditionId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    condition_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    conditions?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    condition?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    roundId?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    round_id?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    status?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    trackName?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    track_name?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    page?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    pageSize?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    page_size?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    limit?: number;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sortBy?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sort_by?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sort?: string;
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sortDirection?: "asc" | "desc";
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    sort_direction?: "asc" | "desc";
                    /** @description Existing query parameter/alias; CSV filters remain comma-separated strings. Validation and defaults are owned by the backend. */
                    order?: "asc" | "desc";
                };
                header?: never;
                path: {
                    trackId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ListResponseOfJsonObject"];
                        "text/json": components["schemas"]["ListResponseOfJsonObject"];
                        "text/plain": components["schemas"]["ListResponseOfJsonObject"];
                    };
                };
                /** @description Invalid query, payload or model binding. Framework validation uses Problem Details; domain validation uses the API error envelope. */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        } | {
                            detail?: null | string;
                            errors?: {
                                [key: string]: string[];
                            };
                            instance?: null | string;
                            /** Format: int32 */
                            status?: null | number;
                            title?: null | string;
                            type?: null | string;
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                403: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description Requested resource unavailable, conflicting operation or invalid imported data. */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
                /** @description API access, database or upstream error. */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            error: {
                                code: string;
                                message: string;
                            };
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        AverageSectorTimeDto: {
            /** Format: double */
            averageTime: number;
            /** Format: int32 */
            samplesCount: number;
            /** Format: int32 */
            sectorIndex: number;
        };
        CategoryMetadataDto: {
            aliases: string[];
            code: string;
            /** Format: int32 */
            displayOrder: number;
            gender: string;
            /** Format: int32 */
            maxAge: null | number;
            /** Format: int32 */
            minAge: null | number;
            name: string;
            shortName: string;
        };
        ChampionshipContext: {
            eligible: boolean;
            session_types: string[];
        };
        ChampionshipProjection: {
            can_change: null | boolean;
            items: components["schemas"]["ChampionshipRider"][];
            /** Format: int32 */
            lead: null | number;
            /** @enum {string} */
            status: "unavailable" | "incomplete" | "tied" | "open" | "secured" | "decided";
        };
        ChampionshipRider: {
            name: string;
            /** Format: int32 */
            points: number;
            rider_id: null | string;
            uci_id: string;
        };
        ChampionshipRun: {
            name: string;
            /** Format: int32 */
            position: null | number;
            /** @enum {string} */
            state: "finished" | "pending" | "dnf" | "dns" | "dsq";
            uci_id: null | string;
        };
        ChampionshipSession: {
            complete: boolean;
            riders: components["schemas"]["ChampionshipRun"][];
            session_type: string;
        };
        ChaosComponentDto: {
            key: string;
            /** Format: int32 */
            sampleSize: number;
            /** Format: double */
            score: null | number;
            /** Format: double */
            weight: number;
        };
        ChaosIndexDto: {
            components: components["schemas"]["ChaosComponentDto"][];
            /** Format: int32 */
            dnfCount: number;
            /** Format: int32 */
            incidentCount: number;
            /** Format: double */
            score: null | number;
            /** Format: int32 */
            starters: number;
        };
        ChronoRaceImportRequest: {
            category_code: string;
            chronorace_json: components["schemas"]["JsonObject"];
            competition_class: null | components["schemas"]["ImportCompetitionClassPayload"];
            condition: null | components["schemas"]["ImportConditionPayload"];
            round: components["schemas"]["ImportRoundPayload"];
            session: components["schemas"]["ImportSessionPayload"];
            track: components["schemas"]["ImportTrackPayload"];
        };
        ChronoRaceImportResponse: {
            points_recalculated: boolean;
            /** Format: int32 */
            results_upserted: number;
            /** Format: int32 */
            riders_created: number;
            /** Format: int32 */
            riders_updated: number;
            round_id: string;
            session_id: string;
            /** Format: int32 */
            splits_upserted: number;
            warnings: string[];
        };
        ChronoRaceRoundFormCategoryPayload: {
            category_code: string;
            chronorace_json: null | components["schemas"]["JsonObject"];
            chronorace_url: null | string;
            result_json?: null | components["schemas"]["JsonObject"];
            result_url?: null | string;
        };
        ChronoRaceRoundFormImportItemResponse: {
            category_code: string;
            chronorace_url: null | string;
            points_recalculated: boolean;
            resolved_chronorace_json_url: null | string;
            /** Format: int32 */
            results_upserted: number;
            /** Format: int32 */
            riders_created: number;
            /** Format: int32 */
            riders_updated: number;
            round_id: null | string;
            session_id: null | string;
            session_name: string;
            session_type: string;
            /** Format: int32 */
            splits_upserted: number;
            warnings: string[];
        };
        ChronoRaceRoundFormImportRequest: {
            competition_class: null | components["schemas"]["ImportCompetitionClassPayload"];
            condition: null | components["schemas"]["ImportConditionPayload"];
            image?: null | components["schemas"]["ImportRoundImagePayload"];
            round: components["schemas"]["ImportRoundPayload"];
            sessions: components["schemas"]["ChronoRaceRoundFormSessionPayload"][];
            track: components["schemas"]["ImportTrackPayload"];
        };
        ChronoRaceRoundFormImportResponse: {
            /** Format: int32 */
            categories_imported: number;
            image_upserted: boolean;
            items: components["schemas"]["ChronoRaceRoundFormImportItemResponse"][];
            /** Format: int32 */
            points_recalculated: number;
            /** Format: int32 */
            results_upserted: number;
            /** Format: int32 */
            riders_created: number;
            /** Format: int32 */
            riders_updated: number;
            round_id: null | string;
            /** Format: int32 */
            sessions_imported: number;
            /** Format: int32 */
            splits_upserted: number;
            warnings: string[];
        };
        ChronoRaceRoundFormSessionPayload: {
            categories: components["schemas"]["ChronoRaceRoundFormCategoryPayload"][];
            condition: null | components["schemas"]["ImportConditionPayload"];
            name: string;
            /** Format: date */
            session_date: null | string;
            session_type: string;
            status: null | string;
        };
        ChronoRaceSessionReimportRequest: {
            chronorace_json: null | components["schemas"]["JsonObject"];
            chronorace_url: null | string;
            result_json?: null | components["schemas"]["JsonObject"];
        };
        ChronoRaceSessionReimportResponse: {
            chronorace_url: null | string;
            import: components["schemas"]["ChronoRaceImportResponse"];
            resolved_chronorace_json_url: null | string;
            session_id: string;
            warnings: string[];
        };
        CommonSessionDto: {
            category: null | string;
            riderIds: number[];
            /** Format: int64 */
            roundId: number;
            /** Format: date */
            sessionDate: null | string;
            /** Format: int64 */
            sessionId: number;
            sessionType: null | string;
        };
        CompareAverageSectorGapDto: {
            /** Format: double */
            averageGap: number;
            isFinishSector: boolean;
            /** Format: int32 */
            samplesCount: number;
            /** Format: int32 */
            sectorIndex: number;
            /** Format: int64 */
            trackId: null | number;
            trackName: null | string;
        };
        ComparePointsProgressDto: {
            /** Format: double */
            awardedPoints: number;
            category: null | string;
            /** Format: double */
            cumulativePoints: number;
            /** Format: date */
            date: null | string;
            /** Format: int64 */
            resultId: number;
            /** Format: int64 */
            roundId: number;
            /** Format: int64 */
            sessionId: number;
            sessionType: null | string;
        };
        CompareResponseDto: {
            commonSessions: components["schemas"]["CompareSessionDto"][];
            riders: components["schemas"]["CompareRiderDto"][];
            sessions: components["schemas"]["CompareSessionDto"][];
            summary: components["schemas"]["CompareSummaryDto"];
        };
        CompareRiderDto: {
            /** Format: int32 */
            age: null | number;
            /** Format: double */
            averageFinalPosition: null | number;
            /** Format: double */
            averageFinishGapToBestSelected: null | number;
            /** Format: double */
            averagePreFinalPosition: null | number;
            averageSectorGapsToBestSelected: components["schemas"]["CompareAverageSectorGapDto"][];
            categories: string[];
            /** Format: double */
            confidence: number;
            /** Format: double */
            consistency: null | number;
            /** Format: double */
            consistencyEvidence: number;
            countryCode: null | string;
            currentCategory: null | string;
            /** Format: int32 */
            finishGapSamplesCount: number;
            firstName: null | string;
            fullName: string;
            lastName: null | string;
            /** Format: double */
            pace: null | number;
            /** Format: int32 */
            podiumsCount: number;
            pointsProgress: components["schemas"]["ComparePointsProgressDto"][];
            profileImageUrl: null | string;
            /** Format: double */
            rating: null | number;
            /** Format: double */
            resultsAveragePosition: null | number;
            /** Format: int64 */
            riderId: number;
            roundMetrics: components["schemas"]["CompareRoundMetricsDto"][];
            sectorGapSummary: components["schemas"]["CompareSectorGapSummaryDto"][];
            teamCode: null | string;
            /** Format: int64 */
            teamId: null | number;
            teamName: null | string;
            /** Format: int32 */
            top10Count: number;
            /** Format: int32 */
            top5Count: number;
            /** Format: double */
            totalPoints: number;
            uciId: null | string;
            /** Format: int32 */
            winsCount: number;
            /** Format: int32 */
            wonSectorsCount: number;
            /** Format: int32 */
            wonSplitsCount: number;
        };
        CompareRoundMetricsDto: {
            competitionClassCode: null | string;
            /** Format: double */
            confidence: number;
            /** Format: double */
            consistency: null | number;
            /** Format: double */
            consistencyEvidence: number;
            /** Format: date */
            date: null | string;
            /** Format: double */
            pace: null | number;
            /** Format: double */
            rating: null | number;
            /** Format: int64 */
            roundId: number;
            /** Format: int32 */
            roundNumber: null | number;
            /** Format: int32 */
            season: null | number;
            /** Format: int64 */
            trackId: null | number;
            trackName: null | string;
            venueName: null | string;
        };
        CompareSectorGapSummaryDto: {
            /** Format: double */
            averageGap: null | number;
            /** Format: int32 */
            samplesCount: number;
            /** Format: int32 */
            sectorIndex: number;
        };
        CompareSectorResultDto: {
            /** Format: double */
            gapToBestSelected: null | number;
            isFinishSector: boolean;
            /** Format: int32 */
            positionAmongSelected: null | number;
            /** Format: int32 */
            sectorIndex: number;
            /** Format: double */
            time: null | number;
        };
        CompareSessionDto: {
            category: null | string;
            competitionClassCode: null | string;
            /** Format: int64 */
            competitionClassId: null | number;
            competitionClassName: null | string;
            condition: null | components["schemas"]["ConditionDto"];
            countryCode: null | string;
            isCommon: boolean;
            results: components["schemas"]["CompareSessionResultDto"][];
            /** Format: int64 */
            roundId: number;
            /** Format: int32 */
            roundNumber: null | number;
            /** Format: int32 */
            season: null | number;
            /** Format: date */
            sessionDate: null | string;
            /** Format: int64 */
            sessionId: number;
            sessionName: null | string;
            sessionType: null | string;
            /** Format: int64 */
            trackId: null | number;
            trackName: null | string;
            venueName: null | string;
        };
        CompareSessionResultDto: {
            /** Format: double */
            finalTime: null | number;
            /** Format: double */
            gapToBestSelected: null | number;
            isClassified: boolean;
            /** Format: int32 */
            position: null | number;
            /** Format: int64 */
            resultId: number;
            /** Format: int64 */
            riderId: number;
            sectors: components["schemas"]["CompareSectorResultDto"][];
            status: null | string;
            /** Format: int64 */
            teamId: null | number;
            teamName: null | string;
        };
        CompareSummaryDto: {
            /** Format: int32 */
            commonSessionsCount: number;
            /** Format: int32 */
            ridersCount: number;
            /** Format: int32 */
            sessionsCount: number;
        };
        ConditionDto: {
            code: null | string;
            /** Format: int64 */
            id: null | number;
            name: null | string;
        };
        CorrelationRiderDto: {
            /** Format: int32 */
            finalPosition: number;
            fullName: string;
            /** Format: int32 */
            preFinalPosition: number;
            /** Format: int64 */
            riderId: number;
        };
        DisplayLabelDto: {
            aliases: string[];
            code: string;
            /** Format: int32 */
            displayOrder: number;
            name: string;
            shortName: string;
        };
        DisplayMetadataDto: {
            categories: components["schemas"]["CategoryMetadataDto"][];
            roundStatuses: components["schemas"]["DisplayLabelDto"][];
            sessionStatuses: components["schemas"]["DisplayLabelDto"][];
            sessionTypes: components["schemas"]["SessionTypeMetadataDto"][];
        };
        FantasyBacktestMetrics: {
            /** Format: double */
            mean_absolute_error: number;
            /** Format: double */
            oracle_actual_points: null | number;
            /** Format: double */
            predicted_team_actual_points: null | number;
            /** Format: double */
            regret: null | number;
            /** Format: int32 */
            rider_count: number;
            /** Format: double */
            root_mean_squared_error: number;
            salary_optimization_unavailable_reason: null | string;
            /** Format: double */
            spearman_rank_correlation: null | number;
            /** Format: double */
            top_k_recall: number;
        };
        FantasyBonusDto: {
            /** Format: int32 */
            points: number;
            /** Format: int32 */
            position: number;
        };
        FantasyCalculationDto: {
            algorithmVersion: string;
            calculationFingerprint: string;
            /** Format: date-time */
            computedAt: string;
            configurationHash: null | string;
            dataRevision: null | string;
            modelVersion: string;
            /** Format: date-time */
            predictionAsOf: null | string;
            /** Format: int32 */
            simulationIterations: null | number;
            /** Format: int32 */
            simulationSeed: null | number;
            /** Format: date-time */
            trainingDataCutoff: null | string;
        };
        FantasyCurrentDto: {
            calculation: null | components["schemas"]["FantasyCalculationDto"];
            fantasyProjectionVersion: string;
            /** Format: date-time */
            fetchedAtUtc: null | string;
            predictionEngineVersion: string;
            priceSnapshotId: null | string;
            recommendation: null | components["schemas"]["FantasyRecommendationDto"];
            riders: components["schemas"]["FantasyRiderDto"][];
            round: null | components["schemas"]["FantasyRoundDto"];
            /** Format: int32 */
            season: number;
            sourceUrl: string;
            status: string;
            warnings: string[];
        };
        FantasyPlacementDto: {
            /** Format: int32 */
            menPoints: null | number;
            /** Format: int32 */
            position: number;
            /** Format: int32 */
            womenPoints: null | number;
        };
        FantasyPreparedRider: {
            /** Format: double */
            confidence: number;
            country_code: null | string;
            /** Format: double */
            expected_fantasy_points: number;
            /** Format: double */
            expected_final_points: number;
            /** Format: double */
            expected_q1_bonus: number;
            gender: string;
            name: string;
            /** Format: double */
            predicted_position: null | number;
            rider_id: string;
        };
        FantasyPreparedRound: {
            backtests: components["schemas"]["FantasyRoundBacktest"][];
            calculation_fingerprint: null | string;
            calibrations: null | {
                [key: string]: components["schemas"]["FantasyStageCalibration"];
            };
            configuration_hash: null | string;
            data_revision: null | string;
            engine_version: string;
            event_fingerprint: string;
            /** Format: date-time */
            prediction_as_of: null | string;
            /** Format: date-time */
            prepared_at_utc: string;
            projection_version: string;
            riders: components["schemas"]["FantasyPreparedRider"][];
            round_id: string;
            /** Format: date-time */
            round_start_utc: string;
            rules_version: string;
            /** Format: int32 */
            season: number;
            /** Format: int32 */
            simulation_iterations: null | number;
            /** Format: int32 */
            simulation_seed: null | number;
            /** Format: date-time */
            training_data_cutoff: null | string;
            training_fields: null | components["schemas"]["FantasyTrainingField"][];
            warnings: string[];
        };
        FantasyRecommendationDto: {
            /** Format: double */
            expectedFantasyPoints: number;
            /** Format: double */
            remainingBudget: number;
            riders: components["schemas"]["FantasyRiderDto"][];
            /** Format: double */
            totalPrice: number;
        };
        FantasyRiderDto: {
            /** Format: double */
            confidence: null | number;
            countryCode: null | string;
            /** Format: double */
            expectedFantasyPoints: null | number;
            /** Format: double */
            expectedFinalPoints: null | number;
            /** Format: double */
            expectedQ1Bonus: null | number;
            /** @enum {string} */
            gender: "male" | "female";
            injuryFlag: boolean;
            isRecommended: boolean;
            name: string;
            pinkbikeExternalId: string;
            /** Format: int32 */
            pinkbikeSeasonPoints: null | number;
            /** Format: double */
            predictedPosition: null | number;
            /** Format: double */
            price: null | number;
            riderId: null | string;
            warnings: string[];
        };
        FantasyRoundBacktest: {
            category: string;
            metrics: components["schemas"]["FantasyBacktestMetrics"];
            round_id: string;
            /** Format: int32 */
            year: number;
        };
        FantasyRoundDto: {
            roundId: string;
            /** Format: int32 */
            roundNumber: null | number;
            startDate: null | string;
            trackName: null | string;
            venue: null | string;
        };
        FantasyRulesDto: {
            /** Format: double */
            budget: number;
            dynamicPricing: boolean;
            finalPlacementPoints: components["schemas"]["FantasyPlacementDto"][];
            /** Format: int32 */
            men: number;
            q1Bonus: components["schemas"]["FantasyBonusDto"][];
            /** Format: int32 */
            season: number;
            sourceUrl: string;
            /** Format: int32 */
            teamSize: number;
            version: string;
            /** Format: int32 */
            women: number;
        };
        FantasyStageCalibration: {
            /** Format: double */
            blend: number;
            empirical_probabilities: {
                [key: string]: number;
            };
            /** Format: int32 */
            events: number;
            /** Format: int32 */
            samples: number;
            /** Format: date-time */
            trained_through_utc: string;
        };
        FantasyTrainingField: {
            context: string;
            /** Format: date-time */
            fetched_at_utc: string;
            gender: string;
            rider_ids: string[];
            source_url: string;
        };
        FieldSpreadDto: {
            classification: string;
            /** Format: int32 */
            fieldSize: number;
            /** Format: double */
            p10GapPercent: null | number;
            points: components["schemas"]["FieldSpreadPointDto"][];
        };
        FieldSpreadPointDto: {
            /** Format: double */
            gapPercent: number;
            /** Format: double */
            gapToLeader: number;
            /** Format: double */
            incrementalSpread: null | number;
            /** Format: double */
            incrementalSpreadPercent: null | number;
            /** Format: int32 */
            position: number;
            /** Format: int32 */
            previousPosition: number;
            /** Format: double */
            raceTime: number;
        };
        /** Format: binary */
        IFormFile: string;
        ImportCompetitionClassPayload: {
            code: string;
            name: string;
            /** Format: int32 */
            priority: null | number;
        };
        ImportConditionPayload: {
            /** Format: int32 */
            id: null | number;
            is_dry: null | boolean;
            name: null | string;
        };
        ImportRoundImagePayload: {
            alt_text: null | string;
            file_name: null | string;
            /** Format: int32 */
            height_px: null | number;
            image_base64: string;
            /** Format: int32 */
            width_px: null | number;
        };
        ImportRoundPayload: {
            competition_class_code?: null | string;
            /** Format: int64 */
            competition_class_id?: null | number;
            context_name: string;
            /** Format: date-time */
            end_date: null | string;
            /** @default false */
            is_season_final_round: boolean;
            /** Format: int32 */
            round_number: null | number;
            /** Format: int32 */
            season_year: number;
            /** Format: date-time */
            start_date: null | string;
            status?: null | string;
        };
        ImportSessionPayload: {
            chronorace_url?: null | string;
            name: string;
            /** Format: date */
            session_date: null | string;
            session_type: string;
            status: null | string;
        };
        ImportTrackPayload: {
            /** Format: double */
            avg_slope: null | number;
            country_code: null | string;
            /** Format: int32 */
            length_m: null | number;
            name: string;
            venue: string;
        };
        /** @description Dynamic JSON from the existing database/provider contract; properties are intentionally not invented. */
        JsonArray: unknown[];
        /** @description Dynamic JSON from the existing database/provider contract; properties are intentionally not invented. */
        JsonNode: unknown;
        /** @description Dynamic JSON from the existing database/provider contract; properties are intentionally not invented. */
        JsonObject: Record<string, never>;
        ListResponseOfJsonObject: {
            data: components["schemas"]["JsonObject"][];
            order: string;
            pagination: components["schemas"]["PaginationMetadata"];
            sort: string;
        };
        PaginationMetadata: {
            /** Format: int32 */
            limit: number;
            /** Format: int32 */
            page: number;
            /** Format: int32 */
            total: number;
            /** Format: int32 */
            total_pages: number;
        };
        PerformanceBinDto: {
            /** Format: int32 */
            count: number;
            /** Format: int32 */
            from: number;
            /** Format: int32 */
            to: number;
        };
        PerformanceDistributionDto: {
            bins: components["schemas"]["PerformanceBinDto"][];
            /** Format: int32 */
            classifiedCount: number;
            /** Format: double */
            median: null | number;
            outliers: components["schemas"]["PerformanceOutlierDto"][];
            /** Format: int32 */
            ridersCount: number;
        };
        PerformanceOutlierDto: {
            fullName: string;
            /** Format: double */
            pace: number;
            /** Format: int64 */
            riderId: number;
        };
        PlannedRoundCreateRequest: {
            category_codes: string[];
            competition_class_code: string;
            /** Format: int64 */
            competition_class_id: number;
            competition_class_name: string;
            /** Format: int32 */
            competition_class_priority: null | number;
            /** Format: int32 */
            condition_id: number;
            context_name?: null | string;
            /** Format: date-time */
            end_date: string;
            image?: null | components["schemas"]["ImportRoundImagePayload"];
            /** @default false */
            is_season_final_round: boolean;
            /** Format: int32 */
            round_number: null | number;
            /** Format: int32 */
            season_year: number;
            /** Format: date-time */
            start_date: string;
            status: string;
            track: null | components["schemas"]["ImportTrackPayload"];
            /** Format: int64 */
            track_id: null | number;
        };
        PlannedRoundCreateResponse: {
            category_codes: string[];
            image_upserted: boolean;
            round_id: string;
            status: string;
            track_id: string;
        };
        PodiumPredictionContextDto: {
            /** Format: double */
            conditionsAffinity: number;
            /** Format: double */
            pressure: number;
            /** Format: double */
            pressureResponse: number;
            /** Format: double */
            recentForm: number;
            /** Format: double */
            trackAffinity: number;
        };
        PodiumPredictionResponseDto: {
            category: string;
            items: components["schemas"]["PodiumPredictionRiderDto"][];
            modelVersion: string;
            round: null | components["schemas"]["SeasonSummaryRoundDto"];
            /** Format: int32 */
            season: number;
        };
        PodiumPredictionRiderDto: {
            /** Format: double */
            confidence: number;
            context: components["schemas"]["PodiumPredictionContextDto"];
            countryCode: null | string;
            /** Format: double */
            currentSeasonRating: null | number;
            /** Format: double */
            expectedPerformance: number;
            /** Format: double */
            expectedPosition: number;
            fullName: string;
            /** Format: double */
            incidentProbability: number;
            /** Format: double */
            lastTrackPace: null | number;
            /** Format: double */
            performanceUncertainty: number;
            /** Format: double */
            podiumProbability: number;
            /** Format: int32 */
            position: number;
            /** Format: double */
            predictionScore: number;
            /** Format: double */
            previousSeasonRating: null | number;
            /** Format: int64 */
            riderId: number;
            /** Format: int64 */
            teamId: null | number;
            teamName: null | string;
            /** Format: double */
            top5Probability: number;
            /** Format: double */
            winProbability: number;
        };
        PointsRecalculateRequest: {
            category_code: null | string;
            scope: null | string;
            /** Format: int32 */
            season_year: null | number;
            session_id: null | string;
        };
        PressurePerformancePointDto: {
            /** Format: date */
            date: null | string;
            /** Format: double */
            delta: null | number;
            /** Format: double */
            finalPace: null | number;
            /** Format: double */
            preFinalPace: null | number;
            preFinalSession: null | string;
            /** Format: double */
            qualifyingPace: null | number;
            /** Format: int64 */
            roundId: number;
            roundName: null | string;
            /** Format: int32 */
            roundNumber: null | number;
            /** Format: int32 */
            season: null | number;
            venueName: null | string;
        };
        PressurePerformanceResponseDto: {
            evidence: string;
            points: components["schemas"]["PressurePerformancePointDto"][];
            /** Format: double */
            pressurePerformance: null | number;
            pressureTrend: string;
            /** Format: int64 */
            riderId: number;
            /** Format: int32 */
            sampleCount: number;
            summary: components["schemas"]["PressurePerformanceSummaryDto"];
        };
        PressurePerformanceSummaryDto: {
            /** Format: double */
            delta: null | number;
            /** Format: double */
            finalPace: null | number;
            /** Format: int32 */
            pairedRounds: number;
            /** Format: double */
            qualifyingPace: null | number;
            tendency: string;
        };
        PublicPagedResponseOfCommonSessionDto: {
            hasNextPage: boolean;
            hasPreviousPage: boolean;
            items: components["schemas"]["CommonSessionDto"][];
            /** Format: int32 */
            page: number;
            /** Format: int32 */
            pageSize: number;
            /** Format: int32 */
            totalItems: number;
            /** Format: int32 */
            totalPages: number;
        };
        PublicPagedResponseOfRiderRoundResultDto: {
            hasNextPage: boolean;
            hasPreviousPage: boolean;
            items: components["schemas"]["RiderRoundResultDto"][];
            /** Format: int32 */
            page: number;
            /** Format: int32 */
            pageSize: number;
            /** Format: int32 */
            totalItems: number;
            /** Format: int32 */
            totalPages: number;
        };
        PublicPagedResponseOfRiderTrackStatisticsDto: {
            hasNextPage: boolean;
            hasPreviousPage: boolean;
            items: components["schemas"]["RiderTrackStatisticsDto"][];
            /** Format: int32 */
            page: number;
            /** Format: int32 */
            pageSize: number;
            /** Format: int32 */
            totalItems: number;
            /** Format: int32 */
            totalPages: number;
        };
        PublicPagedResponseOfRoundListItemDto: {
            hasNextPage: boolean;
            hasPreviousPage: boolean;
            items: components["schemas"]["RoundListItemDto"][];
            /** Format: int32 */
            page: number;
            /** Format: int32 */
            pageSize: number;
            /** Format: int32 */
            totalItems: number;
            /** Format: int32 */
            totalPages: number;
        };
        PublicPagedResponseOfTrackFilterOptionDto: {
            hasNextPage: boolean;
            hasPreviousPage: boolean;
            items: components["schemas"]["TrackFilterOptionDto"][];
            /** Format: int32 */
            page: number;
            /** Format: int32 */
            pageSize: number;
            /** Format: int32 */
            totalItems: number;
            /** Format: int32 */
            totalPages: number;
        };
        QualiFinalCorrelationDto: {
            points: components["schemas"]["CorrelationRiderDto"][];
            preFinalSession: null | string;
            /** Format: double */
            spearman: null | number;
        };
        RankingPreaggregationRefreshRequest: {
            mode: null | string;
        };
        RankingResponseDto: {
            /** @enum {null|string} */
            comparisonBasis: "previousRound" | "defaultFilters" | "previousFilters" | null;
            hasNextPage: boolean;
            hasPreviousPage: boolean;
            items: components["schemas"]["RankingRiderDto"][];
            /** Format: int32 */
            page: number;
            /** Format: int32 */
            pageSize: number;
            summary: components["schemas"]["RankingSummaryDto"];
            /** Format: int32 */
            totalItems: number;
            /** Format: int32 */
            totalPages: number;
        };
        RankingRiderDto: {
            /** Format: double */
            confidence: number;
            /** Format: double */
            consistency: null | number;
            /** Format: double */
            consistencyEvidence: number;
            countryCode: null | string;
            /** Format: int32 */
            finalsCount: number;
            firstName: null | string;
            fullName: string;
            lastName: null | string;
            /** Format: double */
            pace: null | number;
            /** Format: int32 */
            position: number;
            /** Format: int32 */
            positionChange: null | number;
            profileImageUrl: null | string;
            /** Format: double */
            qualifyingRate: number;
            /** Format: double */
            rating: null | number;
            /** Format: int64 */
            riderId: number;
            /** Format: int64 */
            teamId: null | number;
            teamName: null | string;
            /** Format: double */
            totalPoints: number;
            uciId: null | string;
        };
        RankingSummaryDto: {
            /** Format: int32 */
            finalsCount: number;
            /** Format: int32 */
            ridersCount: number;
            /** Format: int32 */
            sessionsCount: number;
        };
        ResultTimeDto: {
            /** Format: double */
            gapToBest: null | number;
            /** Format: double */
            gapToLeader: null | number;
            /** Format: int32 */
            index: number;
            name: string;
            /** Format: int32 */
            position: null | number;
            /** Format: double */
            time: null | number;
        };
        RiderChartStatisticsDto: {
            cumulativePointsByRound: {
                [key: string]: number;
            };
            preFinalAverageByTrack: {
                [key: string]: null | number;
            };
            /** Format: double */
            resultsAveragePosition: null | number;
        };
        RiderOverviewDto: {
            chartStatistics: components["schemas"]["RiderChartStatisticsDto"];
            pressurePerformance: null | components["schemas"]["JsonNode"];
            roundResults: components["schemas"]["RiderRoundResultDto"][];
            sessionResults: components["schemas"]["JsonArray"];
            statistics: components["schemas"]["RiderStatisticsDto"];
            teamHistory: components["schemas"]["JsonArray"];
            trackStatistics: components["schemas"]["RiderTrackStatisticsDto"][];
        };
        RiderProfileImageImportResponse: {
            /** Format: int32 */
            files_processed: number;
            /** Format: int32 */
            images_found: number;
            /** Format: int32 */
            invalid_urls: number;
            /** Format: int32 */
            riders_updated: number;
            /** Format: int32 */
            unchanged: number;
            /** Format: int32 */
            unmatched_riders: number;
            warnings: string[];
        };
        RiderRoundResultDto: {
            /** Format: double */
            awardedPoints: number;
            competitionClassCode: null | string;
            /** Format: int64 */
            competitionClassId: null | number;
            competitionClassName: null | string;
            condition: null | components["schemas"]["ConditionDto"];
            /** Format: double */
            confidence: number;
            /** Format: double */
            consistency: null | number;
            countryCode: null | string;
            /** Format: int32 */
            finalPosition: null | number;
            /** Format: double */
            pace: null | number;
            /** Format: int32 */
            qualifying1Position: null | number;
            /** Format: int32 */
            qualifying2Position: null | number;
            /** Format: int32 */
            qualifyingPosition: null | number;
            /** Format: double */
            rating: null | number;
            /** Format: int64 */
            roundId: number;
            /** Format: int32 */
            roundNumber: null | number;
            /** Format: date */
            roundStartDate: null | string;
            /** Format: int32 */
            season: null | number;
            /** Format: int32 */
            semiFinalPosition: null | number;
            /** Format: int64 */
            trackId: null | number;
            trackName: null | string;
            /** Format: int64 */
            venueId: null | number;
            venueName: null | string;
        };
        RiderSectorProfileDto: {
            /** Format: double */
            consistency: null | number;
            /** Format: double */
            fast: null | number;
            /** Format: double */
            finish: null | number;
            /** Format: double */
            middle: null | number;
            /** Format: double */
            peak: null | number;
            /** Format: double */
            start: null | number;
            /** Format: double */
            technical: null | number;
            /** Format: double */
            variance: null | number;
            /** Format: double */
            weak: null | number;
        };
        RiderSimilarityClusterDto: {
            centroid: components["schemas"]["RiderSectorProfileDto"];
            /** Format: int32 */
            clusterId: number;
            riderIds: string[];
            /** Format: int32 */
            size: number;
            tags: string[];
        };
        RiderSimilarityFiltersDto: {
            categories: string[];
            /** Format: int32 */
            clusterCount: null | number;
            conditions: string[];
            /** Format: int32 */
            minSectors: number;
            /** Format: int32 */
            minSessions: number;
            /** Format: int32 */
            minSharedFeatures: number;
            trackIds: string[];
        };
        RiderSimilarityMergeDto: {
            /** Format: double */
            distance: number;
            leftId: string;
            nodeId: string;
            rightId: string;
            /** Format: int32 */
            size: number;
        };
        RiderSimilarityMetaDto: {
            dataSource: string;
            featureNames: string[];
            /** Format: int32 */
            riderCount: number;
            /** Format: int32 */
            sectorObservationCount: number;
            /** Format: int32 */
            sessionCount: number;
        };
        RiderSimilarityPairDto: {
            riderAId: string;
            riderBId: string;
            /** Format: int32 */
            sharedFeatures: number;
            /** Format: double */
            similarity: null | number;
        };
        RiderSimilarityResponseDto: {
            clusters: components["schemas"]["RiderSimilarityClusterDto"][];
            dendrogram: components["schemas"]["RiderSimilarityMergeDto"][];
            filters: components["schemas"]["RiderSimilarityFiltersDto"];
            meta: components["schemas"]["RiderSimilarityMetaDto"];
            riders: components["schemas"]["RiderSimilarityRiderDto"][];
            similarityMatrix: components["schemas"]["RiderSimilarityPairDto"][];
        };
        RiderSimilarityRiderDto: {
            category: null | string;
            /** Format: int32 */
            clusterId: number;
            countryCode: null | string;
            /** Format: double */
            evidence: number;
            name: string;
            profile: components["schemas"]["RiderSectorProfileDto"];
            profileId: string;
            riderId: string;
            /** Format: int32 */
            sectorCount: number;
            /** Format: int32 */
            sessionCount: number;
            styleTags: string[];
        };
        RiderSpeedDto: {
            final: components["schemas"]["SpeedGroupDto"];
            qualification: components["schemas"]["SpeedGroupDto"];
        };
        RiderStatisticsDto: {
            /** Format: int32 */
            age: null | number;
            /** Format: double */
            averageFinalPosition: null | number;
            /** Format: double */
            averageFinishTime: null | number;
            /** Format: double */
            averagePosition: null | number;
            /** Format: double */
            averageQualifying1Position: null | number;
            /** Format: double */
            averageQualifying2Position: null | number;
            /** Format: double */
            averageQualifyingPosition: null | number;
            averageSectorTimes: components["schemas"]["AverageSectorTimeDto"][];
            /** Format: double */
            averageSemiFinalPosition: null | number;
            /** Format: double */
            confidence: number;
            /** Format: double */
            consistency: null | number;
            countryCode: null | string;
            currentCategory: null | string;
            finalPositions: components["schemas"]["SessionPositionDto"][];
            /** Format: int32 */
            finalWonSectorsCount: number;
            /** Format: int32 */
            finalWonSplitsCount: number;
            firstName: null | string;
            fullName: string;
            gender: null | string;
            lastName: null | string;
            /** Format: double */
            pace: null | number;
            /** Format: int32 */
            podiumsCount: number;
            /** Format: int32 */
            preFinalWonSectorsCount: number;
            /** Format: int32 */
            preFinalWonSplitsCount: number;
            profileImageUrl: null | string;
            qualifyingPositions: components["schemas"]["SessionPositionDto"][];
            /** Format: int32 */
            rankingPosition: null | number;
            /** Format: double */
            rating: null | number;
            /** Format: int64 */
            riderId: number;
            speed: components["schemas"]["RiderSpeedDto"];
            /** Format: int32 */
            startsCount: number;
            teamCode: null | string;
            /** Format: int64 */
            teamId: null | number;
            teamName: null | string;
            /** Format: int32 */
            top10Count: number;
            /** Format: int32 */
            top5Count: number;
            /** Format: double */
            totalPoints: number;
            uciId: null | string;
            /** Format: int32 */
            winsCount: number;
            /** Format: int32 */
            wonSectorsCount: number;
            /** Format: int32 */
            wonSplitsCount: number;
        };
        RiderTeamHistoryDto: {
            /** Format: int64 */
            id: number;
            isCurrent: boolean;
            /** Format: int64 */
            riderId: number;
            /** Format: int64 */
            sourceRoundId: null | number;
            teamCode: null | string;
            /** Format: int64 */
            teamId: number;
            teamName: null | string;
            /** Format: date */
            validFrom: string;
            /** Format: date */
            validTo: null | string;
        };
        RiderTrackStatisticsDto: {
            /** Format: double */
            averageFinalPosition: null | number;
            /** Format: double */
            averageQualifying1Position: null | number;
            /** Format: double */
            averageQualifying2Position: null | number;
            /** Format: double */
            averageQualifyingPosition: null | number;
            /** Format: double */
            averageSemiFinalPosition: null | number;
            /** Format: double */
            confidence: number;
            /** Format: double */
            consistency: null | number;
            countryCode: null | string;
            /** Format: double */
            pace: null | number;
            /** Format: double */
            rating: null | number;
            /** Format: int32 */
            startsCount: number;
            /** Format: int64 */
            trackId: number;
            trackName: null | string;
            /** Format: int64 */
            venueId: null | number;
            venueName: null | string;
        };
        RoundListItemDto: {
            competitionClassCode: null | string;
            /** Format: int64 */
            competitionClassId: null | number;
            competitionClassName: null | string;
            /** Format: int32 */
            competitionClassPriority: null | number;
            contextName: null | string;
            countryCode: null | string;
            /** Format: date */
            endDate: null | string;
            imageUrl: null | string;
            /** Format: int64 */
            roundId: number;
            /** Format: int32 */
            roundNumber: null | number;
            /** Format: int32 */
            season: number;
            /** Format: date */
            startDate: null | string;
            status: string;
            /** Format: int64 */
            trackId: number;
            trackName: null | string;
            /** Format: int64 */
            venueId: null | number;
            venueName: null | string;
        };
        RoundProfileResponseDto: {
            analytics: null | components["schemas"]["RoundRaceAnalyticsDto"];
            category: string;
            fieldSpread: components["schemas"]["FieldSpreadDto"];
            results: components["schemas"]["RoundProfileResultDto"][];
            round: null | components["schemas"]["SeasonSummaryRoundDto"];
            /** Format: int32 */
            season: number;
            /** Format: int64 */
            sessionId: null | number;
            trackFingerprint: components["schemas"]["TrackFingerprintDto"];
        };
        RoundProfileResultDto: {
            countryCode: null | string;
            fullName: string;
            /** Format: double */
            gapToLeader: null | number;
            /** Format: int32 */
            position: number;
            /** Format: double */
            raceTime: null | number;
            /** Format: int64 */
            resultId: number;
            /** Format: int64 */
            riderId: number;
            /** Format: int64 */
            teamId: null | number;
            teamName: null | string;
            /** Format: double */
            topSpeed: null | number;
        };
        RoundRaceAnalyticsDto: {
            chaos: components["schemas"]["ChaosIndexDto"];
            correlation: components["schemas"]["QualiFinalCorrelationDto"];
            distribution: components["schemas"]["PerformanceDistributionDto"];
            methodVersion: string;
            runEfficiency: null | components["schemas"]["RunEfficiencyDto"];
            sectorEfficiency: components["schemas"]["SectorEfficiencyDto"][];
            winningMargin: null | components["schemas"]["WinningMarginDto"];
        };
        RunEfficiencyDto: {
            /** Format: double */
            averageSectorPosition: null | number;
            fullName: string;
            /** Format: int32 */
            measuredSectors: number;
            /** Format: int64 */
            riderId: number;
            /** Format: int32 */
            sectorsCount: number;
            /** Format: int32 */
            sectorsFor80PercentGain: null | number;
            /** Format: int32 */
            sectorsTop3: number;
            /** Format: double */
            sectorsTop3Percent: null | number;
            /** Format: int32 */
            sectorsWon: number;
            /** Format: double */
            sectorsWonPercent: null | number;
        };
        SeasonOverviewResponseDto: {
            lastCompletedRound: null | components["schemas"]["SeasonSummaryRoundDto"];
            nextRound: null | components["schemas"]["SeasonSummaryRoundDto"];
            progress: components["schemas"]["SeasonProgressDto"];
            /** Format: int32 */
            season: number;
        };
        SeasonProgressDto: {
            /** Format: int32 */
            categoriesCount: number;
            /** Format: int32 */
            completedRoundsCount: number;
            /** Format: int32 */
            finalWinnersCount: number;
            /** Format: int32 */
            roundsCount: number;
        };
        SeasonSummaryRoundDto: {
            /** Format: double */
            averageSlope: null | number;
            competitionClassCode: null | string;
            /** Format: int64 */
            competitionClassId: null | number;
            competitionClassName: null | string;
            /** Format: int32 */
            competitionClassPriority: null | number;
            countryCode: null | string;
            /** Format: date */
            endDate: null | string;
            /** Format: int64 */
            roundId: number;
            /** Format: int32 */
            roundNumber: null | number;
            /** Format: int32 */
            season: number;
            /** Format: date */
            startDate: null | string;
            status: string;
            /** Format: int64 */
            trackId: null | number;
            /** Format: double */
            trackLengthMeters: null | number;
            trackName: null | string;
            venueName: null | string;
        };
        SectorContributionDto: {
            /** Format: double */
            gapSeconds: number;
            /** Format: int32 */
            sectorIndex: number;
            /** Format: double */
            sharePercent: null | number;
        };
        SectorEfficiencyDto: {
            /** Format: double */
            positionsPerSecond: null | number;
            /** Format: int32 */
            ridersCount: number;
            /** Format: int32 */
            sectorIndex: number;
        };
        SessionPositionDto: {
            /** Format: int32 */
            position: null | number;
            /** Format: int64 */
            roundId: number;
            /** Format: int64 */
            sessionId: number;
            sessionType: string;
        };
        SessionResultDto: {
            /** Format: double */
            averageSpeed: null | number;
            /** Format: double */
            awardedPoints: number;
            countryCode: null | string;
            /** Format: double */
            finalGapToBest: null | number;
            /** Format: double */
            finalGapToLeader: null | number;
            /** Format: double */
            finalTime: null | number;
            firstName: null | string;
            fullName: string;
            isPerfectRun: boolean;
            lastName: null | string;
            /** Format: int32 */
            position: null | number;
            /** Format: int64 */
            resultId: null | number;
            /** Format: int64 */
            riderId: null | number;
            sessionType: null | string;
            status: null | string;
            /** Format: int64 */
            teamId: null | number;
            teamName: null | string;
            times: components["schemas"]["ResultTimeDto"][];
            /** Format: double */
            topSpeed: null | number;
            uciId: null | string;
        };
        SessionResultsResponseDto: {
            hasNextPage: boolean;
            hasPreviousPage: boolean;
            items: components["schemas"]["SessionResultDto"][];
            /** Format: int32 */
            page: number;
            /** Format: int32 */
            pageSize: number;
            session: components["schemas"]["SessionSummaryDto"];
            /** Format: int32 */
            totalItems: number;
            /** Format: int32 */
            totalPages: number;
        };
        SessionSummaryDto: {
            category: null | string;
            /** Format: int32 */
            completedRidersCount: number;
            condition: null | components["schemas"]["ConditionDto"];
            /** Format: int64 */
            roundId: number;
            /** Format: int32 */
            sectorCount: number;
            /** Format: int64 */
            sessionId: number;
            sessionType: null | string;
            /** Format: int32 */
            splitCount: number;
            /** Format: int32 */
            startedRidersCount: number;
            timeView: string;
        };
        SessionTypeMetadataDto: {
            abbreviation: string;
            aliases: string[];
            code: string;
            /** Format: int32 */
            displayOrder: number;
            groupName: string;
            name: string;
            shortName: string;
        };
        SpeedGroupDto: {
            /** Format: double */
            averageSpeed: null | number;
            /** Format: double */
            topSpeed: null | number;
        };
        TrackFilterOptionDto: {
            /** Format: double */
            avgSlope: null | number;
            countryCode: null | string;
            /** Format: int32 */
            lengthM: null | number;
            /** Format: int64 */
            trackId: number;
            trackName: null | string;
            /** Format: int64 */
            venueId: null | number;
            venueName: null | string;
        };
        TrackFingerprintDto: {
            /** Format: int32 */
            mostDecisiveSector: null | number;
            positionSpread: components["schemas"]["FieldSpreadPointDto"][];
            /** Format: int32 */
            positionSpreadFullPosition: number;
            sectors: components["schemas"]["TrackFingerprintSectorDto"][];
        };
        TrackFingerprintSectorDto: {
            /** Format: double */
            decisiveness: number;
            label: string;
            /** Format: double */
            relativeImpact: number;
            /** Format: int32 */
            ridersCount: number;
            /** Format: double */
            scoreSpread: number;
            /** Format: int32 */
            sectorIndex: number;
        };
        UciMtbWorldSeriesSupplementResponse: {
            /** Format: int32 */
            matched_results: number;
            points_recalculated: boolean;
            /** Format: int32 */
            results_updated: number;
            session_id: string;
            /** Format: int32 */
            skipped_results: number;
            /** Format: int32 */
            source_results: number;
            /** Format: int32 */
            splits_upserted: number;
            warnings: string[];
        };
        WinningMarginDto: {
            /** Format: double */
            marginSeconds: number;
            /** Format: int64 */
            runnerUpId: number;
            runnerUpName: string;
            sectors: components["schemas"]["SectorContributionDto"][];
            /** Format: int64 */
            winnerId: number;
            winnerName: string;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export type operations = Record<string, never>;
