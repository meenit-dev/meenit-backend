import { Injectable } from '@nestjs/common';
import { StorageType } from '../type/storage.type';
import { ResourceRepository } from '../repository/storage.repository';
import { Resource } from '../entity/resource.entity';
import { StorageService } from './storage.service';
import { ResourceProvider } from '../type/resource.type';
import { v7 } from 'uuid';
import * as unzipper from 'unzipper';
import { LIVE2D_EXTENSIONS, Live2DManifest } from '../type/live2d.types';
import { basename } from 'path';

@Injectable()
export class Live2DResourceService {
  private readonly MEENIT_RESOURCE_BASE_URL = process.env.R2_RESOURCE_URL;

  constructor(
    private readonly resourceRepository: ResourceRepository,
    private readonly storageService: StorageService,
  ) {
    this.test(
      Resource.of({
        userId: v7(),
        type: StorageType.PORTFOLIO,
        provider: ResourceProvider.MEENIT,
        key: 'test/%EC%83%81%EC%96%B4%EB%B2%84%EC%A0%84.zip',
        size: 0,
        contentType: 'live2d',
      }),
    );
  }

  async test(resource: Resource) {
    const manifest: Live2DManifest = {
      textures: [],
      expressions: [],
      lipsync: [],
      parameters: [],
      motions: {},
      audio: {},
      others: [],
    };

    const response = await fetch(resource.makeUrl());
    const zipStream = response.body!;
    const directory = zipStream.pipe(unzipper.Parse({ forceStream: true }));

    for await (const entry of directory) {
      const filePath = entry.path;
      const ext = this.resolveExtension(filePath);

      if (!ext) {
        manifest.others!.push(filePath);
        entry.autodrain();
        continue;
      }

      const r2Key = `${r2BasePath}/${filePath}`;

      await this.uploadToR2(r2Key, entry);

      this.appendToManifest(manifest, ext, filePath, r2Key);
    }

    const manifestKey = `${r2BasePath}/manifest.json`;
    await this.uploadJson(manifestKey, manifest);

    return {
      manifestUrl: this.getPublicUrl(manifestKey),
    };
  }

  private resolveExtension(
    path: string,
  ): keyof typeof LIVE2D_EXTENSIONS | null {
    for (const [key, exts] of Object.entries(LIVE2D_EXTENSIONS)) {
      if (exts.some((ext) => path.endsWith(ext))) {
        return key as any;
      }
    }
    return null;
  }

  private appendToManifest(
    manifest: Live2DManifest,
    type: keyof typeof LIVE2D_EXTENSIONS,
    originalPath: string,
    r2Key: string,
  ) {
    const url = this.getPublicUrl(r2Key);

    switch (type) {
      case 'model3':
        manifest.model ??= {};
        manifest.model.model3 = url;
        break;
      case 'moc':
        manifest.model ??= {};
        manifest.model.moc = url;
        break;
      case 'textures':
        manifest.textures!.push(url);
        break;
      case 'motions': {
        const group = basename(originalPath).split('_')[0];
        manifest.motions![group] ??= [];
        manifest.motions![group].push(url);
        break;
      }
      case 'audio': {
        const group = basename(originalPath).split('_')[0];
        manifest.audio![group] ??= [];
        manifest.audio![group].push(url);
        break;
      }
      case 'expressions':
        manifest.expressions!.push(url);
        break;
      case 'physics':
        manifest.physics = url;
        break;
      case 'pose':
        manifest.pose = url;
        break;
      case 'lipsync':
        manifest.lipsync!.push(url);
        break;
      case 'parameters':
        manifest.parameters!.push(url);
        break;
    }
  }

  private async uploadToR2(key: string, body: NodeJS.ReadableStream) {
    await this.r2.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
      }),
    );
  }

  private async uploadJson(key: string, data: any) {
    await this.r2.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: JSON.stringify(data, null, 2),
        ContentType: 'application/json',
      }),
    );
  }

  private getPublicUrl(key: string) {
    return `${process.env.R2_PUBLIC_BASE_URL}/${key}`;
  }
}
