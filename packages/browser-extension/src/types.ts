export type Event = {
  checkPage: {
    message: {
      action: 'checkPage';
      showPlayIcon: boolean;
    };
    response:
      | {
          success: true;
          video: {
            id: string;
            title: string;
            thumbnailUrl: string;
            thumbnailBase64: string | null;
            providerName: string;
            url: string;
            showPlayIcon: boolean;
            needsCloudinary: boolean;
          };
        }
      | { success: false; video: { title: string; url: string; showPlayIcon: boolean; needsCloudinary: boolean } };
  };
  extractPage: {
    message: {
      action: 'extractPage';
      showPlayIcon: boolean;
    };
    response: Event['checkPage']['response'] &
      (
        | {
            success: true;
            video: {
              generatedThumbnailUrl: string;
            };
          }
        | { success: false }
      );
  };
};

export type Response = Event['extractPage']['response'] | Event['checkPage']['response'];
