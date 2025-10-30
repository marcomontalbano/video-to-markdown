import { extractFrame } from '../utils.js';
import VideoProvider from '../VideoProvider.js';

// https://onedrive.live.com/

export default class OneDrive extends VideoProvider {
  get providerName() {
    return 'onedrive';
  }

  get regex() {
    return [
      // - https://1drv.ms/v/s!An21T-lhvYKSkFpqKTb4YeZpKfzC?e=iXCxja
      /https?:\/\/1drv\.ms\/[\w]{1}\/s!([a-zA-Z0-9-]+)/,

      // - https://1drv.ms/v/c/1c827834532d42r1/ETAjK46wOQhKve5q-SzK5kMBvglqiXaAOVnbr7H2Phvve3?e=Qblvee
      /https?:\/\/1drv\.ms\/[\w]{1}\/[\w]{1}\/([a-zA-Z0-9]+\/[a-zA-Z0-9-]+)/,

      // - https://1drv.ms/v/c/9282bd61e94fb57d/EX21T-lhvYIggJJaCAAAAAAB4CNnkKesEiLpVWXGS_cpaw?e=p28kL5
      // - https://onedrive.live.com/?qt=allmyphotos&photosData=%2Fshare%2F9282BD61E94FB57D%212138%3Fithint%3Dvideo%26e%3DiXCxja%26migratedtospo%3Dtrue&sw=bypassConfig&cid=9282BD61E94FB57D&id=9282BD61E94FB57D%212138&redeem=aHR0cHM6Ly8xZHJ2Lm1zL3YvcyFBbjIxVC1saHZZS1NrRnBxS1RiNFllWnBLZnpDP2U9aVhDeGph&v=photos
      // - https://onedrive.live.com/?qt=allmyphotos&photosData=%2Fshare%2F9282BD61E94FB57D%212138%3Fithint%3Dvideo%26e%3Dp28kL5%26migratedtospo%3Dtrue&sw=bypassConfig&cid=9282BD61E94FB57D&id=9282BD61E94FB57D%212138&redeem=aHR0cHM6Ly8xZHJ2Lm1zL3YvYy85MjgyYmQ2MWU5NGZiNTdkL0VYMjFULWxodllJZ2dKSmFDQUFBQUFBQjRDTm5rS2VzRWlMcFZXWEdTX2NwYXc%5FZT1wMjhrTDU&v=photos
      /https?:\/\/onedrive\.live\.com\/(.*)/,
    ];
  }

  needsCloudinary() {
    return true;
  }

  async getThumbnailUrl() {
    const image = document.querySelector('img[src^="blob:https://"]') as HTMLImageElement;

    if (image) {
      return image.src;
    }

    const scale = 1;
    const video = document.querySelector('video');

    return extractFrame(video, scale);
  }
}
