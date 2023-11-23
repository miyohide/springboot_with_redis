package com.github.miyohide.springboot_31;

import io.lettuce.core.ClientOptions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class MyRedisConfigTest {
  @Autowired
  private LettuceConnectionFactory lettuceConnectionFactory;

  @Autowired
  private RedisTemplate<String, String> redisTemplate;

  @Test
  public void testLettuceClientConfigurationCustomization() {
    assertNotNull(lettuceConnectionFactory, "LettuceConnectionFactory is null");
    assertNotNull(redisTemplate, "RedisTemplate is null");

    assertTrue(lettuceConnectionFactory.isUseSsl());
    assertFalse(lettuceConnectionFactory.isVerifyPeer());
  }
}
