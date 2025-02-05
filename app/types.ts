import { IconDefinition, } from "@fortawesome/free-solid-svg-icons";
import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import { positions } from "./constants/layout";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { SimulationConfig } from "simiverse";
import { ResponseFormatJSONSchema } from "openai/resources/shared.mjs";
import { ChatCompletionCreateParamsBase, ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { WebhookEventType } from "replicate";


export type ReplicateModel = `${string}/${string}` | `${string}/${string}:${string}`;

export interface OpenAIConfig {
    api_key: string; 
    models: {
        text?: string[],
        image?: string[],
        video?: string[],
        vision?: string[]

    },
    temperature?: number,
    max_tokens?: number,
}

export interface ReplicateConfig {
    api_key: string; 
    models: {
        image?: ReplicateModel[],
        ocr?: ReplicateModel[],
        text?: ReplicateModel[],
        vision?: ReplicateModel[],
        video?: ReplicateModel[],
        audio?: ReplicateModel[],
        voice_clone?: ReplicateModel[],
        upscale?: ReplicateModel[]
    },
}

export interface AIConfig {
    openai?: OpenAIConfig;
    replicate?: ReplicateConfig;
}

export interface ReplicateRunParams {
    model: ReplicateModel;
    options: { 
        input: object; 
        wait?: { 
        interval?: number | undefined; } | undefined; 
        webhook?: string | undefined; 
        webhook_events_filter?: WebhookEventType[] | undefined; 
        signal?: AbortSignal | undefined; 
    }
}

export interface ReplicateTextOpts {
    max_tokens?: number;
    temperature?: number;
  }

export interface ImageGenOpts {
    cfg: number;
    aspect_ratio:  string;
    output_format:  string;
    output_quality: number,
    negative_prompt:  string;
  }

export interface TranscribeOpts {
    model: string;
    language: string;
    translate: boolean;
    temperature: number;
    transcription: string;
    suppress_tokens: string;
    logprob_threshold: number;
    no_speech_threshold: number;
    condition_on_previous_text: boolean;
    compression_ratio_threshold: number;
    temperature_increment_on_fallback: number;
}
  
export interface UpscaleOptions {
    scale: number,
    face_enhance: boolean
}

export  interface EventHandler {
    event: string;
    handler: (args: any) => void;
}


export type FormattedTranscriptionData = {
    id: number
    start: number,
    end: number,
    text: string
}



export interface OpenaiChatParams {
    systemPrompt?: string;
    opts?:  Omit<Partial<ChatCompletionCreateParamsBase>, 'stream'>;
    chatHistory?: ChatCompletionMessageParam[]
}

export interface GenerateTextFromImageParams extends OpenaiChatParams {
    imageUrl: string
}

export interface GenerateTextFromImagesParams extends OpenaiChatParams {
    imageUrls: string[]
}

export interface GenerateJSONParams extends  OpenaiChatParams{
    responseFormat: ResponseFormatJSONSchema;
    opts?: Omit<Partial<ChatCompletionCreateParamsBase>, 'stream'>;
}



export interface JobResult<T> { 
    status: JobReceipt["status"]; 
    data: T; 
}

export interface JobReceipt {
    jobId: string | undefined;
    status: 'completed' | 'failed' | 'active' | 'delayed' | 'prioritized' | 'waiting' | 'waiting-children' | "unknown";
    queue: number;
    when: number;
    delay: number
}

   export interface PaymentDetails {
    email: string | null;
    name: string;
    receipt_url: string | null;
    chargeId: string;
}

export type UserPlan = 'Free' | 'Basic' | 'Pro' | 'Elite';

export type UserProfileInfo = {
    userPlan: UserPlan, 
    expiresAt: number, 
}

export type UsagePeriod = keyof Usage

export type Usage = {
    today: number;
    month: number;
    total: number;
  }
  
  export interface UsageType {
    name: string;
    count: number;
  }

  export interface User {
    name?: string;
    username?: string;
    email: string;
    password: string;
  }

export interface ChartData {
  x: (string | number)[];
  y: number[];
  xLabel: string;
  yLabel: string;
}

  export interface BaseCard extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    description?: string;
    link?: string;
    cta?: string;
    tags?: string[];
    metadata?: string[];
    icon?: IconProp
    iconColor?: string;
  }
  
  export interface CardProps extends BaseCard   {
    description: string;
    link: string;
    cta: string;
  }

  export interface ListCardProps extends BaseCard   {
    items: string[]
    columns?: number
    listIcon?: IconDefinition
  }
  
  export type NavItem =  {
    name: string;
    link: string;
    newPage?: boolean;
    icon?: any
  } 
  
  export interface NavItemsProps {
    navItems: NavItem[];
  }
  
  export interface LogoProps {
    src: string;
    alt?: string;
    width?:  number | `${number}`;
    height?:  number | `${number}`;
  } 
  
  export interface FileUploaderProps {
    label?: string;
    onFileUpload: (files: File[]) => void; // Updated to handle an array of files
    acceptedFileExt?: string[];
    acceptedMimes: string[];
    className?: string;
    children?: ReactNode;
    fileLimit?: number
  }

  
  export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    children?: ReactNode;
    className?: string;
    icon?: IconProp;
  };
  
  export type AnchorProps = AnchorHTMLAttributes<HTMLAnchorElement>;


export interface PollOptions  {
  interval: number;
  maxDuration: number;
  maxErrors: number;
  onMaxErrors?: () => void;
  onMaxDuration?: () => void;
}

export interface ToastProps {
  title: string;
  description: string;
  logo?: string;
  position?: 'bottom-left' | 'bottom-right' | 'top-right' | 'top-left' | 'center' | 'center-top';
  maxDuration?: number;
  onClose: () => void;
};

export interface ToastOptions extends Omit<ToastProps, 'onClose'> {}


export interface BasePopUpProps {
  title: string;
  description: string;
  position?: keyof typeof positions;
}

export interface LoaderDialogProps extends BasePopUpProps{
  onMinimize :() => void;

}

export interface CTAPopUpProps extends BasePopUpProps{ 
  cta?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export interface ProviderProps {
  children: ReactNode;
}

export interface UserProfileWidgetProps {
  userId: string | undefined | null;    //email/uid/username
  isLoading: boolean
} 

export interface SettingItem {
  type: 'dropdown' | 'toggle' | 'button' | 'text-input';
  label: string;
  options?: string[]; // For dropdown
  value?: string | boolean;
  onChange?: (value: | string | boolean) => void;
}

export interface SettingCategory {
  name: string;
  items: SettingItem[];
}

export interface Settings {
  environment: Record<string, any>
  simulationOptions: Record<string, any> & Partial<SimulationConfig>
}

export interface AnalysisUsageProps {
  usage: number;
  period: string;
}


export interface ActionItem {
  icon: IconDefinition;
  onClick: () => void;
  name: string;
  disabled?: boolean;
  classname?: string;
  condition?: boolean;
}


export interface ThreeProps {
  textureUrl?: string;
  backgroundUrl?: string
}

// Allowed gesture labels.
export type GestureType =
  | "None"
  | "Closed_Fist"
  | "Open_Palm"
  | "Pointing_Up"
  | "Thumb_Down"
  | "Thumb_Up"
  | "Victory"
  | "ILoveYou";
