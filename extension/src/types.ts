export type Event = {
  checkPage: {
    message: {
      action: 'checkPage';
    };
    response?:
      | {
          success: true;
          video: {
            id: string;
            thumbnailUrl: string;
            thumbnailBase64: string;
            providerName: string;
            url: string;
            showPlayIcon: boolean;
          };
        }
      | { success: false };
  };
  extractPage: {
    message: {
      action: 'extractPage';
      showPlayIcon: boolean;
    };
    response?: Event['checkPage']['response'] &
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
