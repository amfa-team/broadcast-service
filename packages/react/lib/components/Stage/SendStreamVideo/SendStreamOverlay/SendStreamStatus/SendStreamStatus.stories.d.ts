import type { Story } from "@storybook/react";
import type { UseSendStreamStatus } from ".";
import { SendStreamStatus } from ".";
declare const _default: {
    title: string;
    component: typeof SendStreamStatus;
    parameters: {
        actions: {
            argTypesRegex: string;
        };
    };
};
export default _default;
export declare const Initial: Story<UseSendStreamStatus>;
export declare const Creating: Story<UseSendStreamStatus>;
export declare const Connecting: Story<UseSendStreamStatus>;
export declare const Connected: Story<UseSendStreamStatus>;
export declare const Disconnected: Story<UseSendStreamStatus>;
export declare const WithError: Story<UseSendStreamStatus>;
//# sourceMappingURL=SendStreamStatus.stories.d.ts.map