package com.github.miyohide.springboot_31;

import io.lettuce.core.ClientOptions;
import io.lettuce.core.SocketOptions;
import io.lettuce.core.resource.ClientResources;
import io.lettuce.core.resource.NettyCustomizer;
import io.netty.bootstrap.Bootstrap;
import io.netty.channel.epoll.EpollChannelOption;
import org.springframework.boot.autoconfigure.data.redis.LettuceClientConfigurationBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Profile("my-redis-config")
@Configuration
public class MyRedisConfig {
  private final MyTCPConfigProperties myTCPConfigProperties;

  MyRedisConfig(MyTCPConfigProperties myTCPConfigProperties) {
    this.myTCPConfigProperties = myTCPConfigProperties;
  }

  @Bean
  public LettuceClientConfigurationBuilderCustomizer lettuceClientConfigurationBuilderCustomizer() {
    ClientResources clientResources =
        ClientResources.builder()
            .nettyCustomizer(
                new NettyCustomizer() {
                  @Override
                  public void afterBootstrapInitialized(Bootstrap bootstrap) {
                    bootstrap.option(
                        EpollChannelOption.TCP_USER_TIMEOUT,
                        myTCPConfigProperties.getTcp_user_timeout());
                  }
                })
            .build();
    SocketOptions socketOptions = SocketOptions.builder().keepAlive(true).build();
    ClientOptions clientOptions = ClientOptions.builder().socketOptions(socketOptions).build();
    return clientConfigurationBuilder -> {
      clientConfigurationBuilder.clientOptions(clientOptions);
      clientConfigurationBuilder.clientResources(clientResources);
    };
  }
}
