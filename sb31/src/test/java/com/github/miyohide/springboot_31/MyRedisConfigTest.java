package com.github.miyohide.springboot_31;

import static org.junit.jupiter.api.Assertions.*;

import io.lettuce.core.ClientOptions;
import io.lettuce.core.resource.ClientResources;
import io.netty.bootstrap.Bootstrap;
import io.netty.channel.epoll.EpollChannelOption;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.session.data.redis.config.ConfigureRedisAction;
import org.springframework.test.context.ActiveProfiles;

@ActiveProfiles("my-redis-config")
@SpringBootTest
public class MyRedisConfigTest {
  @Autowired private ApplicationContext context;

  @Autowired private LettuceConnectionFactory lettuceConnectionFactory;

  @Autowired private RedisTemplate<String, String> redisTemplate;

  @Test
  public void testLettuceClientConfigurationCustomization() {
    assertNotNull(lettuceConnectionFactory, "LettuceConnectionFactory is null");
    assertNotNull(redisTemplate, "RedisTemplate is null");

    ClientOptions clientOptions = lettuceConnectionFactory.getClientConfiguration().getClientOptions().get();
    ClientResources clientResources = lettuceConnectionFactory.getClientResources();
    assertTrue(clientOptions.getSocketOptions().isKeepAlive());

    Bootstrap bootstrap = new Bootstrap();
    clientResources.nettyCustomizer().afterBootstrapInitialized(bootstrap);
    String tcpUserTimeout = bootstrap.config().options().get(EpollChannelOption.TCP_USER_TIMEOUT).toString();
    assertEquals("123452", tcpUserTimeout);
  }

  @Test
  public void testConfigureRedisActionBean() {
    ConfigureRedisAction configureRedisAction = context.getBean(ConfigureRedisAction.class);
    assertEquals(ConfigureRedisAction.NO_OP, configureRedisAction);
  }
}
