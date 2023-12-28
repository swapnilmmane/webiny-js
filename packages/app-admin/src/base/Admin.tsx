import React from "react";
import { App } from "@webiny/app";
import { WcpProvider } from "@webiny/app-wcp";
import { CircularProgress } from "@webiny/ui/Progress";
import { ThemeProvider } from "@webiny/app-theme";
import { TenancyProvider } from "./providers/TenancyProvider";
import { ApolloClientFactory, createApolloProvider } from "./providers/ApolloProvider";
import { Base } from "./Base";
import { createTelemetryProvider } from "./providers/TelemetryProvider";
import { createUiStateProvider } from "./providers/UiStateProvider";
import { SearchProvider } from "./ui/Search";
import { UserMenuProvider } from "./ui/UserMenu";
import { NavigationProvider } from "./ui/Navigation";

export interface AdminProps {
    createApolloClient: ApolloClientFactory;
    children?: React.ReactNode;
}

export const Admin: React.FC<AdminProps> = ({ children, createApolloClient }) => {
    const ApolloProvider = createApolloProvider(createApolloClient);
    const TelemetryProvider = createTelemetryProvider();
    const UiStateProvider = createUiStateProvider();

    // const getBasename = (tenant: string | null) => {
    //     if (tenant === "root") {
    //         return "";
    //     }
    //
    //     return tenant ? `/t_${tenant}` : "";
    // };

    return (
        <ApolloProvider>
            <ThemeProvider>
                <WcpProvider loader={<CircularProgress label={"Loading..."} />}>
                    <TenancyProvider>
                        <App

                            providers={[
                                TelemetryProvider,
                                UiStateProvider,
                                SearchProvider,
                                UserMenuProvider,
                                NavigationProvider
                            ]}
                        >
                            <Base />
                            {children}
                        </App>
                    </TenancyProvider>
                </WcpProvider>
            </ThemeProvider>
        </ApolloProvider>
    );
};
