package com.mit.StayNest.Controller;

import com.mit.StayNest.Services.S3StorageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/uploads")
public class UploadController {

    private static final Logger logger = LoggerFactory.getLogger(UploadController.class);

    private final S3StorageService s3StorageService;

    public UploadController(S3StorageService s3StorageService) {
        this.s3StorageService = s3StorageService;
    }

    @PostMapping("/images")
    public ResponseEntity<?> uploadImages(@RequestParam("files") MultipartFile[] files) {
        if (files == null || files.length == 0) {
            return ResponseEntity.badRequest().body(Map.of("message", "At least one file is required."));
        }

        try {
            List<String> urls = new ArrayList<>();
            for (MultipartFile file : files) {
                if (file.isEmpty()) {
                    continue;
                }
                urls.add(s3StorageService.uploadImage(file));
            }

            logger.info("Uploaded {} image(s) to S3", urls.size());
            return ResponseEntity.ok(Map.of("urls", urls));
        } catch (IllegalArgumentException | IllegalStateException e) {
            logger.warn("Image upload rejected: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (IOException e) {
            logger.error("Failed to upload image(s)", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to upload image(s)."));
        } catch (Exception e) {
            logger.error("Unexpected upload failure", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Unexpected upload failure: " + e.getClass().getSimpleName()));
        }
    }

    @GetMapping("/{key:.+}")
    public ResponseEntity<?> getImage(@PathVariable String key) {
        try {
            String decodedKey = URLDecoder.decode(key, StandardCharsets.UTF_8);
            S3StorageService.StoredObject file = s3StorageService.downloadImage(decodedKey);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(file.contentType()))
                    .header(HttpHeaders.CACHE_CONTROL, "public, max-age=86400")
                    .body(file.content());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", e.getMessage()));
        }
    }
}
