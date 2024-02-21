import { CmsContext } from "~/types";

export const isHeadlessCmsReady = async ({ tenancy, i18n }: CmsContext): Promise<boolean> => {
    /**
     * In case of a fresh webiny project "tenant" and "locale" won't be there until the installation is completed.
     */
    const tenant = tenancy.getCurrentTenant();
    if (!tenant) {
        return true;
    }

    return !i18n.getContentLocale();
};
